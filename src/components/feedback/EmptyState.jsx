import SectionCard from '../layout/SectionCard.jsx'

function EmptyState({ title, message, className = '' }) {
  return (
    <SectionCard
      className={['border-dashed text-center', className].filter(Boolean).join(' ')}
      tone="subtle"
    >
      <div className="mx-auto max-w-md">
        <p className="text-base font-medium text-slate-900">{title}</p>
        <p className="mt-2 text-sm leading-6 text-slate-500">{message}</p>
      </div>
    </SectionCard>
  )
}

export default EmptyState
