function toNumericValue(value) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function toArray(value) {
  return Array.isArray(value) ? value : []
}

function compareMonthValue(left, right) {
  return String(left?.month || '').localeCompare(String(right?.month || ''))
}

export function normalizeMonthlyTrend(items = []) {
  return toArray(items).map((item) => ({
    month: item?.month || '',
    totalIncoming: toNumericValue(item?.total_incoming),
    totalOutgoing: toNumericValue(item?.total_outgoing),
    netFlow: toNumericValue(item?.net_flow),
  }))
}

export function normalizeOutgoingCategories(items = []) {
  return toArray(items).map((item) => ({
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
  const values = toArray(items).flatMap((item) => [
    item.totalIncoming,
    item.totalOutgoing,
    Math.abs(item.netFlow),
  ])
  const maxValue = Math.max(...values, 0)

  return maxValue > 0 ? maxValue : 1
}

export function getCategoryChartMax(items = []) {
  const maxValue = Math.max(...toArray(items).map((item) => item.totalAmount), 0)
  return maxValue > 0 ? maxValue : 1
}

export function getLatestTrendItem(items = []) {
  const normalizedItems = toArray(items)

  if (!normalizedItems.length) {
    return null
  }

  return [...normalizedItems].sort(compareMonthValue).at(-1) || null
}

export function getTopOutgoingCategory(items = []) {
  const normalizedItems = toArray(items)

  if (!normalizedItems.length) {
    return null
  }

  return [...normalizedItems].sort((left, right) => right.totalAmount - left.totalAmount)[0] || null
}

export function getLargestWallet(wallets = []) {
  const normalizedWallets = toArray(wallets)

  if (!normalizedWallets.length) {
    return null
  }

  return [...normalizedWallets]
    .map((wallet) => ({
      ...wallet,
      numericBalance: toNumericValue(wallet?.balance),
    }))
    .sort((left, right) => right.numericBalance - left.numericBalance)[0] || null
}

export function getNetFlowSummary(amount) {
  const numericAmount = toNumericValue(amount)

  if (numericAmount > 0) {
    return {
      label: 'Masih surplus',
      tone: 'bg-emerald-50 text-emerald-700',
    }
  }

  if (numericAmount < 0) {
    return {
      label: 'Lebih banyak keluar',
      tone: 'bg-rose-50 text-rose-700',
    }
  }

  return {
    label: 'Seimbang',
    tone: 'bg-slate-100 text-slate-600',
  }
}
