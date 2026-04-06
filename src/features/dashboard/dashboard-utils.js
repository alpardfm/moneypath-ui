function toNumericValue(value) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function compareMonthValue(left, right) {
  return String(left?.month || '').localeCompare(String(right?.month || ''))
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

export function getLatestTrendItem(items = []) {
  if (!items.length) {
    return null
  }

  return [...items].sort(compareMonthValue).at(-1) || null
}

export function getTopOutgoingCategory(items = []) {
  if (!items.length) {
    return null
  }

  return [...items].sort((left, right) => right.totalAmount - left.totalAmount)[0] || null
}

export function getLargestWallet(wallets = []) {
  if (!wallets.length) {
    return null
  }

  return [...wallets]
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
