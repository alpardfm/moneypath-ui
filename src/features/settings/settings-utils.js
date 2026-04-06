export const currencyOptions = [
  { value: 'idr', label: 'IDR' },
  { value: 'usd', label: 'USD' },
]

export const timezoneOptions = [
  { value: 'Asia/Jakarta', label: 'Asia/Jakarta' },
  { value: 'Asia/Makassar', label: 'Asia/Makassar' },
  { value: 'Asia/Jayapura', label: 'Asia/Jayapura' },
  { value: 'UTC', label: 'UTC' },
]

export const dateFormatOptions = [
  { value: 'DD-MM-YYYY', label: 'DD-MM-YYYY' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
]

export const weekStartDayOptions = [
  { value: 'monday', label: 'Senin' },
  { value: 'sunday', label: 'Minggu' },
]

function findOptionLabel(options, value, fallback = '-') {
  const matchedOption = options.find((option) => option.value === value)
  return matchedOption?.label || fallback
}

export function createSettingsFormFromItem(item) {
  return {
    preferredCurrency: item?.preferred_currency || 'idr',
    timezone: item?.timezone || 'Asia/Jakarta',
    dateFormat: item?.date_format || 'DD-MM-YYYY',
    weekStartDay: item?.week_start_day || 'monday',
  }
}

export function areSettingsFormsEqual(left, right) {
  return (
    left.preferredCurrency === right.preferredCurrency &&
    left.timezone === right.timezone &&
    left.dateFormat === right.dateFormat &&
    left.weekStartDay === right.weekStartDay
  )
}

export function getCurrencyLabel(value) {
  return findOptionLabel(currencyOptions, value, String(value || '-').toUpperCase())
}

export function getTimezoneLabel(value) {
  return findOptionLabel(timezoneOptions, value)
}

export function getDateFormatLabel(value) {
  return findOptionLabel(dateFormatOptions, value)
}

export function getWeekStartDayLabel(value) {
  return findOptionLabel(weekStartDayOptions, value)
}
