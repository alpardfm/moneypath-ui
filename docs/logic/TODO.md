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

## Tasks
- [ ] create debt list page
- [ ] create add debt page
- [ ] create debt detail page
- [ ] create edit debt page
- [ ] connect debt list API
- [ ] connect create debt API
- [ ] connect debt detail API
- [ ] connect update debt API
- [ ] connect inactivate debt API
- [ ] display debt status clearly
- [ ] display remaining debt clearly
- [ ] ensure debt UI remains readable on mobile

## Output
- debt flow works end-to-end

---

# Phase 6 — Mutation Module

## Goal
Build the main money movement flow.

## Tasks
- [ ] create mutation list page
- [ ] create add mutation page
- [ ] create edit mutation page
- [ ] connect mutation list API
- [ ] connect create mutation API
- [ ] connect mutation detail API
- [ ] connect update mutation API
- [ ] add filter UI
- [ ] add pagination UI
- [ ] support related_to_debt toggle
- [ ] support outgoing mutation with existing debt selection
- [ ] support incoming mutation with existing debt or new debt option
- [ ] show validation states clearly
- [ ] optimize mutation form for mobile usage

## Output
- mutation flow works
- debt-related mutation flow works

---

# Phase 7 — Summary Module

## Goal
Show a simple summary page.

## Tasks
- [ ] create summary page
- [ ] connect summary API
- [ ] add date range input
- [ ] display total assets
- [ ] display total debts
- [ ] display incoming
- [ ] display outgoing
- [ ] display net flow
- [ ] handle loading / empty / error states
- [ ] ensure summary is readable on mobile

## Output
- summary page works

---

# Phase 8 — Profile Module

## Goal
Allow user to manage profile data.

## Tasks
- [ ] create profile page
- [ ] connect get me API
- [ ] connect update profile API
- [ ] connect change password API
- [ ] create password change form
- [ ] show success and error feedback
- [ ] keep form UX simple and clear

## Output
- profile flow works

---

# Phase 9 — Polish & Consistency

## Goal
Make the frontend feel stable and coherent.

## Tasks
- [ ] standardize loading states
- [ ] standardize error states
- [ ] standardize empty states
- [ ] review responsive behavior on mobile
- [ ] review spacing and typography
- [ ] review route guards
- [ ] review API error mapping
- [ ] test all major flows manually
- [ ] clean dead code
- [ ] refactor repeated UI carefully
- [ ] review UX friction in forms

## Output
- app feels consistent and ready for real use

---

# Later Backlog

## After MVP
- [ ] better mutation filtering
- [ ] richer dashboard presentation
- [ ] category system
- [ ] recurring transactions
- [ ] notifications
- [ ] export/report
- [ ] advanced settings
