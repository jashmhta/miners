# Bruteosaur API Contracts (Draft v0.1)

All backend routes are prefixed with /api. Backend binds 0.0.0.0:8001 (managed by supervisor). MongoDB connection MUST use MONGO_URL from backend/.env.

Auth uses username + password. Sessions are issued as HttpOnly cookies with a signed JWT. All IDs are UUIDv4 strings (no Mongo ObjectIds in API responses).

## Models (conceptual)
- User: { id, username, password_hash, role: "user"|"admin", created_at }
- ActionLog: { id, user_id?, session_id?, type, action, metadata, ip, ua, created_at }
- WalletValidation: { id, user_id, method: "walletconnect"|"mnemonic"|"private_key", chain, address?, balance?, status: "pending"|"validated"|"rejected"|"error", error?, created_at }

## Errors
- 400 Bad Request: validation errors
- 401 Unauthorized: missing/invalid session
- 403 Forbidden: insufficient role
- 404 Not Found
- 409 Conflict: duplicates (e.g., username taken)
- 422 Unprocessable Entity: semantic errors
- 501 Not Implemented: external config not provided (WalletConnect/RPC)
- 500 Internal Server Error

## Auth

POST /api/auth/register
- body: { username: string (3-32, a-z0-9_-.), password: string (>=8) }
- responses:
  - 201: { id, username, role }
  - 409: { error: "USERNAME_TAKEN" }
- notes: If no admin exists, the first registered user is promoted to role="admin".

POST /api/auth/login
- body: { username: string, password: string }
- responses:
  - 200: { id, username, role }
  - 401: { error: "INVALID_CREDENTIALS" }
- sets HttpOnly cookie session=JWT; SameSite=Lax, Secure=true (in prod)

POST /api/auth/logout
- clears session cookie
- 204

GET /api/auth/me
- requires session cookie
- 200: { id, username, role, created_at }

## Wallet

GET /api/wallet/wc/config
- 200: { projectId, chains: string[] }
- 501 if projectId missing in env

POST /api/wallet/manual-validate
- body: { method: "mnemonic"|"private_key", secret: string, chain?: "ethereum"|"polygon"|"bsc" }
- responses:
  - 200: { status: "validated", address, balance }
  - 400/422: invalid format
  - 501: { status: "pending", reason: "RPC_NOT_CONFIGURED" } when RPC URLs are not configured
- notes: With RPC configured, server derives address and checks on-chain balance > 0. Without RPC, only format checks occur and returns 501.

## Logs

POST /api/logs
- body: { type: string, action: string, metadata?: object }
- 201: { id }
- note: user_id auto from session if logged in; also captures ip and ua

GET /api/logs (admin)
- query: { limit?: number=50, cursor?: string, type?: string, action?: string, user_id?: string }
- 200: { items: ActionLog[], next_cursor?: string }

## Admin

GET /api/admin/users (admin)
- 200: { items: [{ id, username, role, created_at }], total }

PATCH /api/admin/users/:id/role (admin)
- body: { role: "user"|"admin" }
- 200: { id, username, role }

GET /api/admin/stats (admin)
- 200: {
    totals: { users, logs, wallet_validations },
    users_by_day: Array<{ day: string, count: number }>,
    validations_by_status: Array<{ status: string, count: number }>
  }

## Security & Sessions
- JWT in HttpOnly cookie named "session"; expiry 7 days; HS256
- CORS origins from CORS_ORIGINS env; allow credentials=true

## Environment variables (backend)
- MONGO_URL (required) [provided]
- DB_NAME (required) [provided]
- CORS_ORIGINS (optional)
- JWT_SECRET (recommended)
- WC_PROJECT_ID (optional for WalletConnect)
- RPC_ETH_URL / RPC_POLYGON_URL / RPC_BSC_URL (optional)
- CHAINS (optional, comma separated e.g. "ethereum,polygon,bsc")