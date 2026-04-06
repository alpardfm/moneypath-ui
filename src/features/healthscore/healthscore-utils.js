export function getHealthStatusTone(status) {
  switch (status) {
    case 'strong':
      return 'bg-emerald-100 text-emerald-800'
    case 'stable':
      return 'bg-sky-100 text-sky-800'
    case 'watch':
      return 'bg-amber-100 text-amber-800'
    case 'risk':
      return 'bg-rose-100 text-rose-800'
    default:
      return 'bg-slate-100 text-slate-700'
  }
}

export function getHealthStatusLabel(status) {
  switch (status) {
    case 'strong':
      return 'Kuat'
    case 'stable':
      return 'Stabil'
    case 'watch':
      return 'Perlu dipantau'
    case 'risk':
      return 'Berisiko'
    default:
      return 'Belum ada status'
  }
}
