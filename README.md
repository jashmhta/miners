# Bruteosaur (Pixel-close Frontend Replica)

This repository contains a production-style, frontend-first clone of Bruteosaur with multi-page routing, rich animations, and a complete onboarding flow.

Tech stack
- React 19, React Router 7
- TailwindCSS + shadcn/ui primitives + lucide-react icons
- FastAPI template in backend/ (health endpoint only for now)
- Mongo template (not wired yet)

Live pages
- / – Landing with video hero, features, stats, testimonials, CTA
- /demo – Tutorial page with embedded YouTube video
- /simulate – 7s terminal animation sequence
- /auth – Register/Sign-in (email + password validation)
- /connect-wallet – Providers with brand logos + manual connection mock
- /download-guide – BFGMiner download and setup steps
- /technologies – Details of stack and command examples
- /success – Animated success metrics
- /compatibility – Wallets/OS/Browser matrix
- /testimonials – Quotes grid
- /about – Mission, values, roadmap (logo included)

Assets
- public/assets/hero.mp4 – hero background video (local copy)
- public/assets/logo.jpg – current header/about logo (local copy)
- public/assets/logo-alt.jpg – previous green logo (kept for reference)

Environment
- Frontend env: REACT_APP_BACKEND_URL set in frontend/.env (already present in platform). Do not hardcode URLs.
- Backend env: backend/.env with MONGO_URL provided by platform.

Run locally (platform already manages services)
- Frontend: yarn start
- Backend: managed by supervisor (0.0.0.0:8001)

Hot reload
- Both frontend and backend hot reload. Restart only when adding packages or editing .env

Development notes
- All UI copy and data centralised under src/mock.js where applicable
- Scroll/reveal animations via src/components/Reveal.jsx (IntersectionObserver)
- Toasts via shadcn/ui
- Mobile nav via shadcn Sheet

Production readiness
- Current repo is frontend-functional with mocked auth/wallet validation. To make it fully production-ready:
  1) Implement backend endpoints (see contracts.md once added)
  2) Add WalletConnect projectId + chain RPCs
  3) Wire real auth + sessions and admin dashboard for analytics

License
- Replace with your license before public release.