import { formatMonthLabel, getTrendChartMax } from '../../features/dashboard/dashboard-utils.js'
import { formatAmount } from '../../utils/format-number.js'

function TrendBarChart({ items = [] }) {
  const maxValue = getTrendChartMax(items)

  if (!items.length) {
    return null
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.month} className="space-y-2 rounded-2xl bg-slate-50 px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-slate-900">{formatMonthLabel(item.month)}</p>
            <p className="text-xs text-slate-500">Arus bersih {formatAmount(item.netFlow)}</p>
          </div>

          <div className="space-y-2">
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
                <span>Masuk</span>
                <span>{formatAmount(item.totalIncoming)}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-sky-500"
                  style={{ width: `${Math.max((item.totalIncoming / maxValue) * 100, 4)}%` }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
                <span>Keluar</span>
                <span>{formatAmount(item.totalOutgoing)}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-amber-500"
                  style={{ width: `${Math.max((item.totalOutgoing / maxValue) * 100, 4)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default TrendBarChart
