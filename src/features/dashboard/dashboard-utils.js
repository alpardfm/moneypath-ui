function toNumericValue(value) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

export function normalizeMonthlyTrend(items = []) {
  return items.map((item) => ({
    month: item?.month || '',
    totalIncoming: toNumericValue(item?.total_incoming),
    totalOutgoing: toNumericValue(item?.total_outgoing),
    netFlow: toNumericValue(item?.net_flow),
  }))
}

export function normalizeOutgoingCategories(items = []) {
  return items.map((item) => ({
    categoryId: item?.category_id || '',
    categoryName: item?.category_name || 'Tanpa kategori',
    totalAmount: toNumericValue(item?.total_amount),
    share: toNumericValue(item?.share),
  }))
}

export function formatMonthLabel(value) {
  if (!value) {
    return '-'
  }

  const date = new Date(`${value}-01`)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('id-ID', {
    month: 'short',
    year: '2-digit',
  }).format(date)
}

export function getTrendChartMax(items = []) {
  const values = items.flatMap((item) => [
    item.totalIncoming,
    item.totalOutgoing,
    Math.abs(item.netFlow),
  ])
  const maxValue = Math.max(...values, 0)

  return maxValue > 0 ? maxValue : 1
}

export function getCategoryChartMax(items = []) {
  const maxValue = Math.max(...items.map((item) => item.totalAmount), 0)
  return maxValue > 0 ? maxValue : 1
}
