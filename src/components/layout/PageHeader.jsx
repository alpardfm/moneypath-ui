function PageHeader({ eyebrow, title, className = '' }) {
  return (
    <div className={['space-y-1.5', className].filter(Boolean).join(' ')}>
      {eyebrow ? <p className="text-sm font-medium text-slate-500">{eyebrow}</p> : null}
      <h1 className="text-[2rem] font-semibold tracking-tight text-slate-900 sm:text-4xl">
        {title}
      </h1>
    </div>
  )
}

export default PageHeader
