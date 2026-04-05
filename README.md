# Moneypath UI

Moneypath UI is the frontend application for Moneypath, a single-user personal finance product built to help users track wallets, debts, money movements, dashboard, and summary in a clear and practical way.

This frontend is built as a **responsive web application** using **React JS**, with a layout that works well on both desktop and mobile browsers.

The goal of this project is not to build a flashy finance platform.  
The goal is to build a frontend that feels:

- usable
- clear
- trustworthy
- responsive
- simple enough for daily use

---

## Product Direction

Moneypath is a **single-user personal finance product**.

The frontend should help users:

- login and access their account
- manage wallets
- manage debts
- record money movements
- see dashboard and summary
- use the app comfortably on desktop and mobile

This is an MVP-first product.  
Version one should prioritize **clarity, trust, and usability**, not feature overload.

---

## Tech Stack

### Frontend
- React JS
- Vite
- Tailwind CSS
- React Router
- Fetch API or Axios for API calls
- Responsive web design

### Backend
This frontend consumes the existing `moneypath-api` backend.

Backend modules already available:
- auth
- profile
- wallet
- debt
- mutation
- dashboard
- summary

---

## Product Scope

### Included in MVP
- Register
- Login
- Dashboard
- Wallet list
- Create wallet
- Edit wallet
- Debt list
- Create debt
- Debt detail
- Edit debt
- Mutation list
- Create mutation
- Edit mutation
- Summary
- Profile
- Change password

### Not Included Yet
- advanced analytics
- recurring transactions
- notifications
- export/report
- category-heavy tracking
- multi-user support
- complex settings
- unnecessary visual polish
- overengineered architecture

---

## Core Domain Concepts

### Wallet
Wallet is where money is stored.

Examples:
- BRI
- Jago
- Gopay
- Cash

Rules:
- user can have multiple wallets
- wallet balance must not be edited directly from UI
- wallet balance changes only through mutations
- inactive wallet should not appear in active selection

### Debt
Debt represents liabilities.

Rules:
- debt can be created directly
- debt may be related to mutation flow
- debt has remaining amount
- debt can become `lunas`
- debt should be displayed clearly

### Mutation
Mutation is the main financial event source.

Types:
- masuk
- keluar

Rules:
- all balance-changing events go through mutation
- mutation can be edited
- mutation should not be treated as deletable product behavior in the UI
- outgoing mutation must respect wallet balance rules
- mutation may optionally relate to debt

---

## Frontend Principles

This frontend must be:

- responsive on desktop and mobile
- clean and readable
- practical for daily use
- simple to navigate
- easy to maintain
- aligned with backend contract

### UX priorities
- fast login/register flow
- easy wallet and debt management
- mutation form must be clear
- dashboard must be easy to scan
- summary must be readable on mobile
- errors and loading states must be visible

### UI tone
- calm
- clean
- trustworthy
- not noisy
- not childish
- not overly decorative

---

## Suggested Folder Direction

A simple structure is preferred:

- `src/app` → app shell, providers, router
- `src/pages` → route-level pages
- `src/components` → reusable UI components
- `src/features` → feature-specific UI and logic
- `src/services` → API calls
- `src/hooks` → reusable hooks when truly needed
- `src/utils` → small helper utilities
- `src/types` → shared types

The structure should stay simple and should not be overdesigned too early.

---

## MVP Success Criteria

Moneypath UI is successful if:

- user can complete main flows without confusion
- desktop and mobile layouts both work well
- API integration is stable
- wallet, debt, and mutation flows are understandable
- the product feels like a real usable app, not a mockup

---

## Build Direction

Recommended implementation order:

1. project setup
2. app shell and responsive layout
3. auth flow
4. dashboard
5. wallet module
6. debt module
7. mutation module
8. summary and profile
9. polish and consistency review

---

## Final Reminder

Moneypath UI is not meant to impress with complexity.

It should win by being:
- clear
- stable
- responsive
- practical
- honest to the product scope

---

## CI/CD

Deploy otomatis sudah disiapkan lewat GitHub Actions.

Alur:
- `pull_request` ke `master`: menjalankan lint dan build
- `push` ke `master`: menjalankan lint, build, lalu deploy via SSH

Target deploy:
- host: `103.87.67.209`
- user: `alpardfm`
- base path produksi frontend: `/moneypath/`
- domain tujuan: `https://alpardfm.my.id/moneypath`

File workflow:
- `.github/workflows/ci-cd.yml`

GitHub Secrets yang wajib diisi:
- `DEPLOY_SSH_PRIVATE_KEY`
  Isi private key dari `~/.ssh/id_ed25519`
- `DEPLOY_PATH`
  Isi absolute path folder server yang memang dilayani web server untuk `/moneypath`
  Contoh yang umum: `/var/www/alpardfm.my.id/moneypath`

Catatan penting:
- workflow ini hanya mengirim hasil build `dist/` ke server
- konfigurasi web server di mesin tujuan tetap perlu sudah mengarah ke folder `DEPLOY_PATH`
- untuk production build, Vite sudah diset memakai base path `/moneypath/`
- workflow tidak lagi mencoba membuat folder deploy secara otomatis di server
- `DEPLOY_PATH` harus sudah ada dan harus writable untuk user `alpardfm`

Persiapan server satu kali:

```bash
sudo mkdir -p /var/www/alpardfm.my.id/moneypath
sudo chown -R alpardfm:alpardfm /var/www/alpardfm.my.id/moneypath
```

Kalau tidak ingin memberi akses tulis ke `/var/www`, gunakan folder yang memang writable untuk user deploy, misalnya:

```text
/home/alpardfm/apps/moneypath
```

Lalu arahkan web server ke folder tersebut.
