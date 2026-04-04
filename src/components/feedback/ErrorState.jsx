import SectionCard from '../layout/SectionCard.jsx'

function ErrorState({
  title = 'Something went wrong',
  message = 'Please try again in a moment.',
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <SectionCard className={className + ' border-rose-200 bg-rose-50'}>
      <p className="font-medium text-rose-900">{title}</p>
      <p className="mt-2 text-sm leading-6 text-rose-700">{message}</p>
      {actionLabel ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 rounded-xl bg-rose-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-rose-800"
        >
          {actionLabel}
        </button>
      ) : null}
    </SectionCard>
  )
}

export default ErrorState
