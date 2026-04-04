import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../app/providers/useAuth.jsx'
import PageContainer from '../components/layout/PageContainer.jsx'

function LoginPage() {
  const { login } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const redirectTo = location.state?.from || '/app/dashboard'

  const handleDemoLogin = () => {
    login('phase-0-demo-token')
    navigate(redirectTo, { replace: true })
  }

  return (
    <PageContainer className="flex min-h-screen items-center py-8">
      <div className="grid w-full gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-[1.2fr_0.8fr] lg:p-8">
        <section className="space-y-4">
          <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
            Phase 0 foundation
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Login flow wiring starts here.
          </h1>
          <p className="max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
            The real auth form and API integration are intentionally deferred to Phase 2. This page
            exists so we can verify routing, protected pages, and token storage now.
          </p>
          <button
            type="button"
            onClick={handleDemoLogin}
            className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white hover:bg-slate-800"
          >
            Enter demo shell
          </button>
        </section>

        <aside className="rounded-2xl bg-slate-50 p-5">
          <p className="text-sm font-medium text-slate-900">What this page covers</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>Route access control</li>
            <li>Redirect after login</li>
            <li>Token persistence foundation</li>
          </ul>
          <p className="mt-6 text-sm text-slate-600">
            Need an account page later? Continue in{' '}
            <Link className="font-medium text-slate-900 underline" to="/register">
              register setup
            </Link>
            .
          </p>
        </aside>
      </div>
    </PageContainer>
  )
}

export default LoginPage
