# Moneypath UI Rules for AI Agent

This file defines the rules for AI agents working on `moneypath-ui`.

The objective is to keep implementation aligned with the product direction, avoid scope creep, and make the frontend clean, responsive, and practical.

---

## Project Context

Project name: `moneypath-ui`

This is the frontend for Moneypath, a **single-user personal finance product**.

Frontend direction:
- React JS
- Vite
- Tailwind CSS
- Responsive web app
- Desktop and mobile friendly
- MVP-first

---

## Main Objective

Build a frontend that:
- connects to the existing backend cleanly
- works well on desktop and mobile
- keeps financial flows understandable
- feels like a real usable product
- avoids unnecessary complexity

This is not a playground for experimental architecture.
This is not a place to overbuild.

---

## Core Product Rules

### 1. Wallet balance must not be edited directly
Do not create UI that edits wallet balance directly.

### 2. Mutation is the main financial event source
All balance-changing behavior must be represented through mutations.

### 3. Mutation must not be treated as a deletable feature
Do not build delete mutation in the UI unless explicitly requested.

### 4. Debt relation in mutation must stay explicit
If a mutation is related to debt, the UI must make that relationship clear.

### 5. Responsive layout is mandatory
Every page must be usable on desktop and mobile widths.

### 6. MVP scope must be respected
Do not silently add advanced features.

---

## Allowed Scope

AI agent may work on:
- project setup
- responsive layout
- auth pages
- dashboard page
- wallet pages
- debt pages
- mutation pages
- summary page
- profile page
- API integration
- loading / empty / error states
- reusable components with clear purpose
- practical form UX

---

## Out of Scope Unless Explicitly Requested

AI agent must not add:
- advanced analytics
- recurring transactions
- notifications
- export/report
- category system
- dark/light mode system
- complex animation system
- SSR migration
- overly abstract architecture
- state library migration without reason
- optimistic finance-critical actions
- delete mutation feature
- multi-user support
- offline mode
- unnecessary charts by default

---

## UI / UX Rules

### General
- prioritize clarity over decoration
- use a clean and calm visual tone
- keep typography readable
- keep spacing consistent
- avoid visually noisy layouts
- keep financial information easy to scan

### Mobile
- no desktop-only layout assumptions
- avoid horizontal overflow
- forms must remain usable on small screens
- lists and cards must stack cleanly
- actions should remain reachable on mobile

### Forms
- keep forms short and structured
- group related fields clearly
- validation errors must be visible and understandable
- loading states must be visible
- submit state must be clear
- finance forms must feel explicit and safe

---

## Engineering Rules

### Architecture
- keep structure simple
- prefer practical modularity
- avoid premature abstraction
- avoid giant utility systems
- avoid custom patterns with no clear benefit
- extract reusable components only when repetition is clear

### State Management
- use the simplest state approach that fits the problem
- keep local state local
- do not introduce heavy state libraries unless truly needed

### API Integration
- respect backend response structure
- centralize API calls cleanly
- handle unauthorized states consistently
- handle validation and server errors consistently
- do not invent unsupported API fields
- do not silently reinterpret finance meaning

### Styling
- use Tailwind CSS
- keep styling consistent
- do not add random inline styles unless necessary
- avoid overcomplicated design tokens in MVP

---

## AI Agent Working Rules

For every task, the AI agent must:

### 1. Start with scope
Always state:
- what feature is being built
- what files will be created
- what files will be modified
- what is intentionally out of scope

### 2. Keep module boundaries clear
Do not edit unrelated modules unless necessary.

### 3. Preserve product rules
Never break wallet, debt, or mutation behavior rules.

### 4. Keep output practical
Generate production-friendly MVP code.

### 5. Explain assumptions
If something is unclear, state the assumption clearly before coding.

---

## Required Output Format for AI Agent

Every implementation response should follow this structure:

### Plan
- scope
- files to create
- files to modify
- assumptions
- out of scope

### Implementation
- UI structure
- state logic
- API integration
- responsive considerations

### Validation
- manual test steps
- edge cases
- mobile checks

### Notes
- what was intentionally not built
- next possible step

---

## Page Priorities

Priority order should be:

1. project setup
2. app shell
3. auth
4. dashboard
5. wallet
6. debt
7. mutation
8. summary
9. profile
10. polish

Do not jump into fancy enhancements before core flows are done.

---

## Design Tone

The interface should feel:
- calm
- practical
- trustworthy
- clean
- mature
- not childish
- not flashy

---

## Final Rule

Build the smallest clean version that feels real.

Do not expand scope silently.
Do not overengineer.
Do not sacrifice clarity for cleverness.