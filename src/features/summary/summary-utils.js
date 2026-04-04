export function createCurrentMonthRange() {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  return {
    from: toDateInputValue(firstDay),
    to: toDateInputValue(lastDay),
  }
}

export function createSummaryFilterState() {
  return createCurrentMonthRange()
}

export function toDateInputValue(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function getSummaryPeriodLabel(summary) {
  if (!summary?.from && !summary?.to) {
    return 'Semua waktu'
  }

  const formatter = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const fromLabel = summary?.from ? formatter.format(new Date(summary.from)) : 'awal'
  const toLabel = summary?.to ? formatter.format(new Date(summary.to)) : 'sekarang'

  return `${fromLabel} - ${toLabel}`
}

export function isSummaryEmpty(summary) {
  if (!summary) {
    return true
  }

  const totals = [
    summary.total_assets,
    summary.total_debts,
    summary.total_incoming,
    summary.total_outgoing,
    summary.net_flow,
  ]

  const hasAnyNonZeroTotal = totals.some((item) => Number(item || 0) !== 0)
  const hasWallets = Array.isArray(summary.wallets) && summary.wallets.length > 0

  return !hasAnyNonZeroTotal && !hasWallets
}
