import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../providers/useAuth.jsx'
import PageContainer from '../../components/layout/PageContainer.jsx'

const navigationItems = [
  { label: 'Dashboard', shortLabel: 'Home', to: '/app/dashboard', enabled: true },
  { label: 'Wallets', shortLabel: 'Wallet', to: '/app/wallets', enabled: true },
  { label: 'Debts', shortLabel: 'Debt', to: '/app/debts', enabled: true },
  { label: 'Mutations', shortLabel: 'Flow', enabled: false },
]

function AppShell() {
  const { logout } = useAuth()

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="pointer-events-none fixed inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top,_rgba(14,116,144,0.14),_transparent_56%)]" />

      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <PageContainer className="flex flex-col gap-4 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Link to="/app/dashboard" className="text-lg font-semibold tracking-tight text-slate-900">
                Moneypath
              </Link>
              <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
                Clear, practical finance tracking for daily personal use.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700 sm:block">
                Auth ready
              </div>
              <button
                type="button"
                onClick={logout}
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Logout
              </button>
            </div>
          </div>

          <nav className="hidden flex-wrap gap-2 md:flex">
            {navigationItems.map((item) =>
              item.enabled ? (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className={({ isActive }) =>
                    [
                      'rounded-full px-4 py-2 text-sm font-medium transition',
                      isActive
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
                    ].join(' ')
                  }
                >
                  {item.label}
                </NavLink>
              ) : (
                <span
                  key={item.label}
                  className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-400"
                >
                  {item.label}
                </span>
              ),
            )}
          </nav>
        </PageContainer>
      </header>

      <main className="relative py-6 sm:py-8">
        <Outlet />
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur md:hidden">
        <PageContainer className="px-0" size="app">
          <div className="grid grid-cols-4 gap-2">
            {navigationItems.map((item) =>
              item.enabled ? (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className={({ isActive }) =>
                    [
                      'flex min-h-14 items-center justify-center rounded-2xl px-3 text-xs font-medium transition',
                      isActive
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
                    ].join(' ')
                  }
                >
                  {item.shortLabel}
                </NavLink>
              ) : (
                <span
                  key={item.label}
                  className="flex min-h-14 items-center justify-center rounded-2xl bg-slate-100 px-3 text-center text-xs font-medium text-slate-400"
                >
                  {item.shortLabel}
                </span>
              ),
            )}
          </div>
        </PageContainer>
      </nav>

      <div className="h-24 md:hidden" aria-hidden="true" />
    </div>
  )
}

export default AppShell
