import { useAuth } from '../app/providers/useAuth.jsx'
import EmptyState from '../components/feedback/EmptyState.jsx'
import PageContainer from '../components/layout/PageContainer.jsx'

function DashboardPage() {
  const { logout } = useAuth()

  return (
    <PageContainer>
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700">
            Protected route check
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">Dashboard foundation is ready.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            This page is a protected placeholder so we can confirm routing, app shell rendering,
            spacing, and token-based access before building the real dashboard in Phase 3.
          </p>
          <button
            type="button"
            onClick={logout}
            className="mt-6 rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Logout
          </button>
        </section>

        <section>
          <EmptyState
            title="No dashboard data yet"
            message="Real metrics, balances, and API integration will be added when the dashboard phase starts."
          />
        </section>
      </div>
    </PageContainer>
  )
}

export default DashboardPage
