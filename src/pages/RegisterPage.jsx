import { Link } from 'react-router-dom'
import EmptyState from '../components/feedback/EmptyState.jsx'
import PageContainer from '../components/layout/PageContainer.jsx'

function RegisterPage() {
  return (
    <PageContainer className="flex min-h-screen items-center py-8">
      <div className="w-full space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
        <div className="space-y-3">
          <span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-sm font-medium text-sky-700">
            Deferred by plan
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Register comes in Phase 2.</h1>
          <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Phase 0 only prepares the route and page structure. The actual registration form, API
            request, and validation handling are intentionally not built yet.
          </p>
        </div>

        <EmptyState
          title="Registration UI is not implemented yet"
          message="This placeholder keeps route structure ready without expanding scope before the auth phase."
        />

        <p className="text-sm text-slate-600">
          Return to{' '}
          <Link className="font-medium text-slate-900 underline" to="/login">
            login
          </Link>
          .
        </p>
      </div>
    </PageContainer>
  )
}

export default RegisterPage
