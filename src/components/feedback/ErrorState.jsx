function ErrorState({
  title = 'Something went wrong',
  message = 'Please try again in a moment.',
  actionLabel,
  onAction,
}) {
  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 shadow-sm">
      <p className="font-medium text-rose-900">{title}</p>
      <p className="mt-2 text-sm text-rose-700">{message}</p>
      {actionLabel ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 rounded-lg bg-rose-700 px-4 py-2 text-sm font-medium text-white hover:bg-rose-800"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  )
}

export default ErrorState
