# Bruteosaur – Phase 2 Roadmap (Next Session)

This document captures what remains to ship the full Bruteosaur miners website with live backend integration and complete admin monitoring.

Current status (this phase)
- Backend: Auth (username/password + HttpOnly cookie session), Logs, Admin users/logs/stats, Wallet manual validation with real on-chain RPC checks (Ethereum, Polygon, BSC with default public RPCs; env overrides supported). WalletConnect config endpoint returns 501 until projectId provided.
- Admin dashboard UI: Login-only (no register). First admin is auto-seeded at startup via env (ADMIN_SEED_USERNAME / ADMIN_SEED_PASSWORD) with secure defaults. Displays Users, Logs, Stats.
- Contracts: /app/contracts.md written.

Decisions/assumptions
- Admin is separate app only for monitoring.
- Miners site (Bruteosaur) is separate app and will be wired to backend logs and validation in Phase 2.
- WalletConnect remains placeholder until WC projectId is provided; manual connect is the enforced path for now.

What remains (Phase 2)
1) Wire miners website to backend (replace mocks)
   - API client in miners frontend using process.env.REACT_APP_BACKEND_URL with credentials.
   - Instrument logs: POST /api/logs on
     - Page views (Home, Demo, Technologies, Compatibility, Success, Testimonials, About, Simulate)
     - CTA clicks (Start Mining Now, Download Now, Demo, System Check)
     - Auth submit attempts (register/sign-in) with { success, username }
     - Provider connect attempts (provider key)
     - Manual validate attempts/results with { method, chain, validated, address?, balance? }
     - Download started on DownloadGuide
   - Auth on miners site
     - Migrate from email to username if desired, or keep UI-only and rely on wallet validation. Confirm preference.
     - If using backend auth: /api/auth/register and /api/auth/login; on success, continue to /connect-wallet.
   - Manual Connect
     - Call POST /api/wallet/manual-validate with method and chain; handle errors: INVALID_MNEMONIC_FORMAT, INVALID_PRIVATE_KEY_FORMAT, ZERO_BALANCE, RPC_CONNECT failures.
     - On success (validated), route to /download-guide.

2) WalletConnect integration (optional until keys provided)
   - Provide WC projectId; backend GET /api/wallet/wc/config will start returning config.
   - Frontend: integrate WalletConnect v2 client; if provider connect fails or not configured, fallback to manual.

3) Improve Admin Dashboard
   - Add role switcher (PATCH /api/admin/users/:id/role).
   - Add log filters (type/action/user) and pagination UI using next_cursor.
   - Add CSV export.
   - Add quick cards for most-clicked CTAs and wallet validation conversion rates.

4) Security & hardening
   - Optionally add rate limiting (slowapi/redis) for /logs and /wallet/manual-validate.
   - Rotate admin seed values via env in production; do not rely on defaults.
   - Strict error messages for validation endpoints; hide internal details.

5) Testing
   - Add UI tests for miners site flows (animation → auth → manual connect → download) with mocked responses.
   - Expand backend pytest suite for wallet validation edge cases and rate limiting.

6) Performance & UX polish
   - 7-second terminal animation script on hero before auth prompt.
   - Ensure smooth routing transitions and toasts for all network outcomes.

Required inputs before Phase 2 (if enabling these)
- WalletConnect projectId (WC_PROJECT_ID)
- Optional: Dedicated RPC URLs (RPC_ETH_URL, RPC_POLYGON_URL, RPC_BSC_URL) for reliability (Infura/Alchemy/etc.)
- Confirmation on miners auth model: username/password via backend vs. UI-only + wallet validation gate.

Environment references
- Frontend: REACT_APP_BACKEND_URL must be used for all API calls.
- Backend binds 0.0.0.0:8001 and all routes are prefixed /api.
- MongoDB: use MONGO_URL from backend/.env.

Deployment/scale notes
- Public RPCs are fine for initial validation; production should move to private RPC endpoints.
- Add indexes are created; collections: users, logs, wallet_validations.