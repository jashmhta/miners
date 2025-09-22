# Changelog (Current Phase)

- Implemented FastAPI backend (server.py) with:
  - Auth: /api/auth/register, /api/auth/login, /api/auth/logout, /api/auth/me (HttpOnly cookie sessions)
  - Logs: /api/logs (captures user_id if session, ip, ua, metadata)
  - Wallet:
    - GET /api/wallet/wc/config → 501 until WC_PROJECT_ID present
    - POST /api/wallet/manual-validate → real EVM RPC validation for mnemonic/private_key; rejects zero-balance wallets
  - Admin:
    - GET /api/admin/users, PATCH /api/admin/users/:id/role
    - GET /api/admin/logs (filters + cursor), GET /api/admin/stats
  - Startup: index creation + admin seed (ADMIN_SEED_USERNAME / ADMIN_SEED_PASSWORD; defaults exist, set env in prod)
- Updated backend requirements for web3/bip-utils.
- Added contracts.md and PHASE_NEXT_STEPS.md to repo root.

Notes
- WalletConnect left as placeholder; manual connect is enforced until projectId is provided.
- Public RPC defaults are used if env not provided (Ethereum, Polygon, BSC). Recommend private RPC in production.