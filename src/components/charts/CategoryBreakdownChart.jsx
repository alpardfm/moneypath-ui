import { getCategoryChartMax } from '../../features/dashboard/dashboard-utils.js'
import { formatAmount } from '../../utils/format-number.js'

function CategoryBreakdownChart({ items = [] }) {
  const maxValue = getCategoryChartMax(items)

  if (!items.length) {
    return null
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={`${item.categoryId}-${item.categoryName}`}
          className="space-y-2 rounded-2xl bg-slate-50 px-4 py-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-900">{item.categoryName}</p>
              <p className="mt-1 text-xs text-slate-500">{item.share.toFixed(1)}% dari pengeluaran</p>
            </div>
            <p className="text-sm font-semibold text-slate-900">{formatAmount(item.totalAmount)}</p>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-rose-500"
              style={{ width: `${Math.max((item.totalAmount / maxValue) * 100, 6)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default CategoryBreakdownChart
