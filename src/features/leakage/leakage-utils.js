export function getLeakageSeverityTone(severity) {
  switch (severity) {
    case 'high':
      return 'bg-rose-100 text-rose-800'
    case 'medium':
      return 'bg-amber-100 text-amber-800'
    case 'low':
      return 'bg-sky-100 text-sky-800'
    default:
      return 'bg-slate-100 text-slate-700'
  }
}

export function getLeakageSeverityLabel(severity) {
  switch (severity) {
    case 'high':
      return 'Tinggi'
    case 'medium':
      return 'Sedang'
    case 'low':
      return 'Rendah'
    default:
      return 'Info'
  }
}
