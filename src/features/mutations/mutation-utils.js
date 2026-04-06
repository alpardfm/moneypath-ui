export const mutationTypeOptions = [
  { value: '', label: 'Semua tipe' },
  { value: 'masuk', label: 'Masuk' },
  { value: 'keluar', label: 'Keluar' },
]

export const relatedToDebtFilterOptions = [
  { value: '', label: 'Semua relasi debt' },
  { value: 'true', label: 'Terkait debt' },
  { value: 'false', label: 'Tanpa debt' },
]

export const sortByOptions = [
  { value: 'happened_at', label: 'Tanggal kejadian' },
  { value: 'created_at', label: 'Tanggal dibuat' },
  { value: 'amount', label: 'Nominal' },
]

export const sortDirectionOptions = [
  { value: 'desc', label: 'Terbaru / terbesar dulu' },
  { value: 'asc', label: 'Terlama / terkecil dulu' },
]

export const debtModeOptions = [
  { value: 'existing', label: 'Pilih debt yang sudah ada' },
  { value: 'new', label: 'Buat debt baru dari mutasi ini' },
]

export function getMutationTone(type) {
  return type === 'masuk' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
}

export function getMutationLabel(type) {
  return type === 'masuk' ? 'Masuk' : 'Keluar'
}

export function createMutationFormFromItem(item) {
  return {
    walletId: item?.wallet_id || '',
    debtId: item?.debt_id || '',
    type: item?.type || 'masuk',
    amount: item?.amount || '',
    description: item?.description || '',
    relatedToDebt: Boolean(item?.related_to_debt),
    debtMode: item?.debt_action === 'borrow_new' ? 'new' : 'existing',
    happenedAt: item?.happened_at ? toDateTimeLocal(item.happened_at) : createCurrentDateTimeLocal(),
    newDebtName: '',
    newDebtPrincipalAmount: '',
    newDebtTenorValue: '',
    newDebtTenorUnit: '',
    newDebtPaymentAmount: '',
    newDebtNote: '',
  }
}

export function createMutationFilterState() {
  return {
    type: '',
    walletId: '',
    categoryId: '',
    debtId: '',
    relatedToDebt: '',
    from: '',
    to: '',
    sortBy: 'happened_at',
    sortDirection: 'desc',
    page: 1,
    pageSize: 10,
  }
}

export function toIsoDateTime(value) {
  if (!value) {
    return ''
  }

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : date.toISOString()
}

export function toDateTimeLocal(value) {
  if (!value) {
    return ''
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  const timezoneOffset = date.getTimezoneOffset()
  const localDate = new Date(date.getTime() - timezoneOffset * 60 * 1000)
  return localDate.toISOString().slice(0, 16)
}

export function createCurrentDateTimeLocal() {
  return toDateTimeLocal(new Date().toISOString())
}
