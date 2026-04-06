# Moneypath UI TODO

This file defines the phased task list for building `moneypath-ui`.

Frontend direction:
- React JS
- Vite
- Tailwind CSS
- Responsive web
- Desktop + mobile friendly
- MVP-first

---

# Phase 0 — Project Setup

## Goal
Prepare a clean frontend foundation.

## Tasks
- [x] initialize React + Vite project
- [x] install Tailwind CSS
- [x] setup base folder structure
- [x] setup React Router
- [x] setup environment variables
- [x] setup API base configuration
- [x] setup shared layout foundation
- [x] setup protected route pattern
- [x] setup error and loading patterns
- [x] setup README, TODO, RULE docs
- [x] setup basic eslint / formatting config

## Output
- app runs locally
- routing works
- base layout exists
- API layer has starting structure

---

# Phase 1 — App Shell & Responsive Layout

## Goal
Create the main layout system for desktop and mobile.

## Tasks
- [x] create app shell
- [x] create responsive header
- [x] create mobile-friendly navigation
- [x] create page container component
- [x] create section/card component
- [x] create loading state component
- [x] create empty state component
- [x] create error state component
- [x] define spacing and content width rules
- [x] verify layout on desktop and mobile widths

## Output
- consistent layout foundation
- mobile responsiveness starts working early

---

# Phase 2 — Auth Flow

## Goal
Allow user to register, login, and enter protected pages.

## Tasks
- [x] create register page
- [x] create login page
- [x] connect register API
- [x] connect login API
- [x] store auth token
- [x] implement protected routes
- [x] implement logout flow
- [x] handle invalid auth states
- [x] handle auth error messages
- [x] redirect user correctly after auth

## Output
- auth flow works end-to-end

---

# Phase 3 — Dashboard

## Goal
Show the first useful overview after login.

## Tasks
- [x] create dashboard page
- [x] fetch dashboard API
- [x] display total assets
- [x] display total debts
- [x] display total incoming
- [x] display total outgoing
- [x] display wallet balances
- [x] add loading / empty / error states
- [x] optimize layout for mobile readability

## Output
- dashboard is usable and readable

---

# Phase 4 — Wallet Module

## Goal
Allow user to manage wallets.

## Notes
- wallet detail page was added to make edit flow and wallet history easier to understand
- wallet detail now shows related mutation history filtered by `wallet_id`
- wallet list action was clarified so it points to detail instead of relying on an ambiguous inline edit flow

## Tasks
- [x] create wallet list page
- [x] create add wallet page or modal
- [x] create edit wallet page or modal
- [x] connect wallet list API
- [x] connect create wallet API
- [x] connect update wallet API
- [x] connect inactivate wallet API
- [x] show active wallet states clearly
- [x] handle empty wallet state
- [x] handle validation and API errors

## Output
- wallet flow works end-to-end

---

# Phase 5 — Debt Module

## Goal
Allow user to manage debts clearly.

## Notes
- debt detail now shows related mutation history filtered by `debt_id`
- money amount inputs in debt flow were tightened to numeric-only input in the UI
- debt detail is intended to reduce context switching before opening the mutation module

## Tasks
- [x] create debt list page
- [x] create add debt page
- [x] create debt detail page
- [x] create edit debt page
- [x] connect debt list API
- [x] connect create debt API
- [x] connect debt detail API
- [x] connect update debt API
- [x] connect inactivate debt API
- [x] display debt status clearly
- [x] display remaining debt clearly
- [x] ensure debt UI remains readable on mobile

## Output
- debt flow works end-to-end

---

# Phase 6 — Mutation Module

## Goal
Build the main money movement flow.

## Notes
- happened at on create mutation defaults to the current local date and time, but remains editable
- money amount inputs in mutation flow were tightened to numeric-only input in the UI
- optional list query handling was refined so unsupported values like `related_to_debt=undefined` are not sent to the API
- backend error envelopes with nested `error.message` are surfaced more clearly in the UI

## Tasks
- [x] create mutation list page
- [x] create add mutation page
- [x] create edit mutation page
- [x] connect mutation list API
- [x] connect create mutation API
- [x] connect mutation detail API
- [x] connect update mutation API
- [x] add filter UI
- [x] add pagination UI
- [x] support related_to_debt toggle
- [x] support outgoing mutation with existing debt selection
- [x] support incoming mutation with existing debt or new debt option
- [x] show validation states clearly
- [x] optimize mutation form for mobile usage

## Output
- mutation flow works
- debt-related mutation flow works

---

# Phase 7 — Summary Module

## Goal
Show a simple summary page.

## Notes
- date range filtering belongs here instead of the MVP dashboard
- dashboard should stay as a quick overview unless later product direction changes

## Tasks
- [x] create summary page
- [x] connect summary API
- [x] add date range input
- [x] display total assets
- [x] display total debts
- [x] display incoming
- [x] display outgoing
- [x] display net flow
- [x] handle loading / empty / error states
- [x] ensure summary is readable on mobile

## Output
- summary page works

---

# Phase 8 — Profile Module

## Goal
Allow user to manage profile data.

## Tasks
- [x] create profile page
- [x] connect get me API
- [x] connect update profile API
- [x] connect change password API
- [x] create password change form
- [x] show success and error feedback
- [x] keep form UX simple and clear

## Output
- profile flow works

---

# Phase 9 — Polish & Consistency

## Goal
Make the frontend feel stable and coherent.

## Notes
- standardize UI copy to full Bahasa Indonesia across the app
- do not add language switch in MVP unless explicitly requested later
- CI/CD GitHub Actions was added for lint, build, and SSH deploy to production subpath `/moneypath/`
- deploy path on server must be prepared once and writable for the deploy user before GitHub Actions can publish build output
- public and protected route guards were reviewed so auth-ready checks are consistent before redirecting
- API service error handling was tightened so empty responses, nested backend messages, and fallback status text are handled more safely
- repeated success feedback banners were refactored into a shared component to keep UI behavior more consistent
- top-level page headers now use a shared layout pattern so title spacing and typography stay more even across major pages
- dead navigation branches that were no longer used were removed from the app shell to reduce low-value code paths

## Tasks
- [x] standardize loading states
- [x] standardize error states
- [x] standardize empty states
- [x] review responsive behavior on mobile
- [x] review spacing and typography
- [x] review route guards
- [x] review API error mapping
- [x] test all major flows manually
- [x] clean dead code
- [x] refactor repeated UI carefully
- [x] review UX friction in forms
- [x] standardize language usage across labels, buttons, helper text, and page copy

## Output
- app feels consistent and ready for real use

---

# Backend Sync Notes

Recent backend changes that FE should now be aware of:
- `GET /dashboard` now returns extra chart-ready fields:
  - `monthly_trend`
  - `outgoing_categories`
- new archive endpoints are available:
  - `GET /wallets/archive`
  - `GET /debts/archive`
- new notification feed endpoint is available:
  - `GET /notifications`
- backend post-MVP modules that now already exist:
  - category system
  - recurring transactions
  - monthly analytics
  - financial health scoring
  - leakage detection
  - export/report
  - richer settings

---

# Phase 10 — Backend Sync Follow-up

## Goal
Adapt the UI to the latest backend capabilities that were added after the initial frontend MVP phases.

## Tasks
- [x] update dashboard page to consume `monthly_trend`
- [x] add chart component for monthly incoming / outgoing / net flow
- [x] update dashboard page to consume `outgoing_categories`
- [x] add outgoing category breakdown chart/card
- [x] add wallet archive page or archive section using `GET /wallets/archive`
- [x] add debt archive page or archive section using `GET /debts/archive`
- [x] add notifications page, drawer, or dropdown using `GET /notifications`
- [x] show recurring due notifications clearly
- [x] show active debt reminder notifications clearly
- [x] decide where financial health score should appear in UI
- [x] decide where leakage detection insights should appear in UI
- [x] decide where export/report action should live in summary or mutation pages
- [x] add category management UI if not already exposed clearly
- [x] add settings UI for:
  preferred currency, timezone, date format, and week start day
- [x] verify API typings/contracts for new backend response fields

## Output
- frontend fully reflects the latest backend surface
- dashboard becomes more visual
- archive and notification flows become usable in UI

---

# Later Backlog

## After MVP
- [x] better mutation filtering
- [x] richer dashboard presentation
- [ ] consider optional dashboard date range only after summary flow is stable
- [ ] consider bilingual support only after full copy consistency is finished
- [x] harden deployment workflow with environment protection, zero-downtime strategy, and rollback plan
- [x] advanced settings polish beyond current backend settings scope
