import SectionCard from '../layout/SectionCard.jsx'

function LoadingState({
  title = 'Loading',
  message = 'Please wait while we prepare this page.',
  className = '',
}) {
  return (
    <SectionCard className={className}>
      <div className="flex items-start gap-3 sm:items-center">
        <span className="mt-1 inline-flex h-3 w-3 shrink-0 animate-pulse rounded-full bg-emerald-500 sm:mt-0" />
        <div>
          <p className="font-medium text-slate-900">{title}</p>
          <p className="mt-1 text-sm leading-6 text-slate-500">{message}</p>
        </div>
      </div>
    </SectionCard>
  )
}

export default LoadingState
