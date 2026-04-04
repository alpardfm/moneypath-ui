import { Link, NavLink, Outlet } from 'react-router-dom'
import PageContainer from '../../components/layout/PageContainer.jsx'

const navigationItems = [
  { label: 'Dashboard', to: '/app/dashboard', enabled: true },
  { label: 'Wallets', enabled: false },
  { label: 'Debts', enabled: false },
  { label: 'Mutations', enabled: false },
]

function AppShell() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <PageContainer className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link to="/app/dashboard" className="text-lg font-semibold text-slate-900">
              Moneypath
            </Link>
            <p className="text-sm text-slate-500">
              A calm frontend foundation for daily finance tracking.
            </p>
          </div>

          <nav className="flex flex-wrap gap-2">
            {navigationItems.map((item) => (
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
              )
            ))}
          </nav>
        </PageContainer>
      </header>

      <main className="py-6 sm:py-8">
        <Outlet />
      </main>
    </div>
  )
}

export default AppShell
