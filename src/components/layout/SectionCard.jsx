function SectionCard({
  children,
  className = '',
  as: Component = 'section',
  tone = 'default',
}) {
  const toneClasses = {
    default: 'border-slate-200 bg-white',
    subtle: 'border-slate-200 bg-slate-50/80',
    muted: 'border-slate-200 bg-slate-100/80',
  }

  return (
    <Component
      className={[
        'rounded-3xl border p-4 shadow-sm sm:p-6',
        toneClasses[tone] || toneClasses.default,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </Component>
  )
}

export default SectionCard
