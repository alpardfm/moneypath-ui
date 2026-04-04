import { Link } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer.jsx'
import SectionCard from '../components/layout/SectionCard.jsx'

function NotFoundPage() {
  return (
    <PageContainer className="flex min-h-screen items-center justify-center py-8 sm:py-10" size="narrow">
      <SectionCard className="w-full text-center sm:p-8">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">404</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Page not found</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          The route does not exist in the current MVP setup.
        </p>
        <Link
          to="/login"
          className="mt-6 inline-flex rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white hover:bg-slate-800"
        >
          Go to login
        </Link>
      </SectionCard>
    </PageContainer>
  )
}

export default NotFoundPage
