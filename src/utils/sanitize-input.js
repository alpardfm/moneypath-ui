export function sanitizeDigits(value) {
  return String(value || '').replace(/\D/g, '')
}
