import SectionCard from '../layout/SectionCard.jsx'

function SuccessBanner({ message }) {
  if (!message) {
    return null
  }

  return (
    <SectionCard tone="subtle" className="border-emerald-200 bg-emerald-50">
      <p className="text-sm text-emerald-800">{message}</p>
    </SectionCard>
  )
}

export default SuccessBanner
