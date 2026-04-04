function LoadingState({ title = 'Loading', message = 'Please wait while we prepare this page.' }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-3 w-3 animate-pulse rounded-full bg-emerald-500" />
        <div>
          <p className="font-medium text-slate-900">{title}</p>
          <p className="text-sm text-slate-500">{message}</p>
        </div>
      </div>
    </div>
  )
}

export default LoadingState
