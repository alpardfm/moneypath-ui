import { useAuth } from '../app/providers/useAuth.jsx'
import EmptyState from '../components/feedback/EmptyState.jsx'
import PageContainer from '../components/layout/PageContainer.jsx'
import SectionCard from '../components/layout/SectionCard.jsx'

function DashboardPage() {
  const { logout } = useAuth()

  return (
    <PageContainer className="space-y-6">
      <div className="space-y-3">
        <p className="text-sm font-medium text-slate-500">App Shell Preview</p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Responsive foundation is ready for the next modules.
        </h1>
        <p className="max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
          Phase 1 focuses on the layout system, so this page remains intentionally lightweight while
          using the shared shell, section card, spacing, and mobile-safe structure.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <SectionCard>
          <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700">
            Shared card pattern
          </span>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Dashboard foundation is ready.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            This page is a protected placeholder so we can confirm routing, app shell rendering,
            spacing, and token-based access before building the real dashboard in Phase 3.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={logout}
              className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Logout
            </button>
            <span className="inline-flex items-center rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-500">
              Desktop and mobile spacing tuned
            </span>
          </div>
        </SectionCard>

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
