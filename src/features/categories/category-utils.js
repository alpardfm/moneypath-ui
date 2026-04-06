export const categoryTypeOptions = [
  { value: '', label: 'Semua tipe' },
  { value: 'masuk', label: 'Masuk' },
  { value: 'keluar', label: 'Keluar' },
]

export const categoryCreateTypeOptions = [
  { value: 'masuk', label: 'Masuk' },
  { value: 'keluar', label: 'Keluar' },
]

export function getCategoryTypeTone(type) {
  return type === 'masuk' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
}

export function getCategoryTypeLabel(type) {
  return type === 'masuk' ? 'Masuk' : 'Keluar'
}
