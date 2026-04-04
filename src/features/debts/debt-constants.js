export const tenorUnitOptions = [
  { value: '', label: 'Pilih tenor unit' },
  { value: 'day', label: 'Hari' },
  { value: 'week', label: 'Minggu' },
  { value: 'month', label: 'Bulan' },
  { value: 'year', label: 'Tahun' },
]

export function getTenorUnitLabel(value) {
  return tenorUnitOptions.find((item) => item.value === value)?.label || value || 'Belum diatur'
}
