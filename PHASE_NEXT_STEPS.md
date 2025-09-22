# Bruteosaur – Phase 2 Roadmap (Next Session)

This document captures what remains to ship the full Bruteosaur miners website with live backend integration and complete admin monitoring.

Current status (this phase)
- Backend: Auth (username/password + HttpOnly cookie session), Logs, Admin users/logs/stats, Wallet manual validation with real on-chain RPC checks (Ethereum, Polygon, BSC with default public RPCs; env overrides supported). WalletConnect config endpoint returns 501 until projectId provided.
- Admin dashboard UI: Login-only (no register). First admin is auto-seeded at startup via env (ADMIN_SEED_USERNAME / ADMIN_SEED_PASSWORD) with secure defaults. Displays Users, Logs, Stats.
- Contracts: contracts.md written in repo root.

Decisions/assumptions
- Admin is separate app only for monitoring.
- Miners site (Bruteosaur) is separate app and will be wired to backend logs and validation in Phase 2.
- WalletConnect remains placeholder until WC projectId is provided; manual connect is the enforced path for now.

What remains (Phase 2)
1) Wire miners website to backend (replace mocks)
   - API client in miners frontend using REACT_APP_BACKEND_URL with credentials.
   - Instrument logs: POST /api/logs on page views, CTAs, auth attempts, provider attempts, manual validate attempts/results, download start.
   - Auth on miners site: username/password via backend or keep UI-only and rely on wallet validation; confirm preference.
   - Manual Connect: call /api/wallet/manual-validate; handle INVALID_MNEMONIC_FORMAT, INVALID_PRIVATE_KEY_FORMAT, ZERO_BALANCE, RPC errors; success routes to /download-guide.

2) WalletConnect integration (optional until keys provided)
   - Provide WC projectId; backend GET /api/wallet/wc/config will start returning config.
   - Frontend: integrate WalletConnect v2; fallback to manual otherwise.

3) Admin Dashboard enhancements
   - Role switcher, log filters & pagination UI, CSV export, analytics cards.

4) Security & hardening
   - Optional rate limiting for /logs and /wallet/manual-validate.
   - Rotate admin seed via env in production.

5) Testing
   - UI tests for miners flow (hero animation → auth → manual connect → download) with mocked responses.
   - Expand backend pytest suite for validation & rate limiting.