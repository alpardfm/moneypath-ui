import { useEffect, useState } from 'react'
import CategoryBreakdownChart from '../components/charts/CategoryBreakdownChart.jsx'
import TrendBarChart from '../components/charts/TrendBarChart.jsx'
import EmptyState from '../components/feedback/EmptyState.jsx'
import ErrorState from '../components/feedback/ErrorState.jsx'
import LoadingState from '../components/feedback/LoadingState.jsx'
import PageContainer from '../components/layout/PageContainer.jsx'
import PageHeader from '../components/layout/PageHeader.jsx'
import SectionCard from '../components/layout/SectionCard.jsx'
import { getDashboardOverview } from '../features/dashboard/dashboard-service.js'
import {
  formatMonthLabel,
  getLargestWallet,
  getLatestTrendItem,
  getNetFlowSummary,
  getTopOutgoingCategory,
  normalizeMonthlyTrend,
  normalizeOutgoingCategories,
} from '../features/dashboard/dashboard-utils.js'
import { getFinancialHealthReport } from '../features/healthscore/healthscore-service.js'
import {
  getHealthStatusLabel,
  getHealthStatusTone,
} from '../features/healthscore/healthscore-utils.js'
import { formatAmount } from '../utils/format-number.js'

const metricCards = [
  {
    key: 'total_assets',
    label: 'Total aset',
    valueKey: 'total_assets',
    tone: 'bg-emerald-50 text-emerald-700',
  },
  {
    key: 'total_debts',
    label: 'Total utang',
    valueKey: 'total_debts',
    tone: 'bg-rose-50 text-rose-700',
  },
  {
    key: 'total_incoming',
    label: 'Total masuk',
    valueKey: 'total_incoming',
    tone: 'bg-sky-50 text-sky-700',
  },
  {
    key: 'total_outgoing',
    label: 'Total keluar',
    valueKey: 'total_outgoing',
    tone: 'bg-amber-50 text-amber-700',
  },
]

function DashboardPage() {
  const [dashboard, setDashboard] = useState(null)
  const [healthReport, setHealthReport] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [healthErrorMessage, setHealthErrorMessage] = useState('')

  const loadDashboard = async () => {
    try {
      setIsLoading(true)
      setErrorMessage('')
      setHealthErrorMessage('')

      const [dashboardResult, healthResult] = await Promise.allSettled([
        getDashboardOverview(),
        getFinancialHealthReport(),
      ])

      if (dashboardResult.status !== 'fulfilled') {
        throw dashboardResult.reason
      }

      setDashboard(dashboardResult.value)

      if (healthResult.status === 'fulfilled') {
        setHealthReport(healthResult.value)
      } else {
        setHealthReport(null)
        setHealthErrorMessage(
          healthResult.reason?.message || 'Skor kesehatan keuangan belum bisa dimuat.',
        )
      }
    } catch (error) {
      setErrorMessage(error.message || 'Gagal memuat dashboard.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  if (isLoading) {
    return (
      <PageContainer className="space-y-6">
        <PageHeader eyebrow="Dashboard" title="Menyiapkan ringkasan keuangan kamu." />
        <LoadingState
          title="Memuat dashboard"
          message="Saldo wallet dan ringkasan arus kas sedang diambil dari server."
        />
      </PageContainer>
    )
  }

  if (errorMessage) {
    return (
      <PageContainer className="space-y-6">
        <PageHeader eyebrow="Dashboard" title="Dashboard belum bisa dimuat." />
        <ErrorState
          title="Gagal mengambil data dashboard"
          message={errorMessage}
          actionLabel="Coba lagi"
          onAction={loadDashboard}
        />
      </PageContainer>
    )
  }

  if (!dashboard) {
    return (
      <PageContainer className="space-y-6">
        <PageHeader eyebrow="Dashboard" title="Belum ada data dashboard." />
        <EmptyState
          title="Dashboard masih kosong"
          message="Pastikan akun kamu sudah punya wallet atau mutasi agar ringkasan bisa ditampilkan."
        />
      </PageContainer>
    )
  }

  const monthlyTrend = normalizeMonthlyTrend(dashboard.monthly_trend)
  const outgoingCategories = normalizeOutgoingCategories(dashboard.outgoing_categories)
  const latestTrend = getLatestTrendItem(monthlyTrend)
  const topOutgoingCategory = getTopOutgoingCategory(outgoingCategories)
  const largestWallet = getLargestWallet(dashboard.wallets)
  const netFlowSummary = getNetFlowSummary(dashboard.net_flow)

  return (
    <PageContainer className="space-y-6">
      <PageHeader eyebrow="Dashboard" title="Ringkasan keuangan." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((item) => (
          <SectionCard key={item.key} className="space-y-3">
            <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${item.tone}`}>
              {item.label}
            </span>
            <div>
              <p className="text-3xl font-semibold tracking-tight text-slate-900">
                {formatAmount(dashboard[item.valueKey])}
              </p>
            </div>
          </SectionCard>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <SectionCard className="space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-500">Arus bersih</p>
              <h2 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
                {formatAmount(dashboard.net_flow)}
              </h2>
            </div>
            <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
              {dashboard.wallets?.length || 0} wallet aktif
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${netFlowSummary.tone}`}
            >
              {netFlowSummary.label}
            </span>
            {latestTrend ? (
              <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
                Snapshot {formatMonthLabel(latestTrend.month)}
              </span>
            ) : null}
          </div>
        </SectionCard>

        {dashboard.wallets?.length ? (
          <SectionCard className="space-y-3">
            <div>
              <p className="text-sm font-medium text-slate-500">Saldo wallet</p>
            </div>
            <div className="space-y-3">
              {dashboard.wallets.map((wallet) => (
                <div
                  key={wallet.wallet_id}
                  className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900">{wallet.name}</p>
                    <p className="text-xs text-slate-500">Wallet aktif</p>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">
                    {formatAmount(wallet.balance)}
                  </p>
                </div>
              ))}
            </div>
          </SectionCard>
        ) : (
          <EmptyState
            title="Belum ada wallet aktif"
            message="Saat wallet pertama dibuat, daftar saldo wallet akan muncul di dashboard ini."
          />
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard className="space-y-2">
          <p className="text-sm font-medium text-slate-500">Bulan terbaru</p>
          {latestTrend ? (
            <>
              <p className="text-xl font-semibold tracking-tight text-slate-900">
                {formatMonthLabel(latestTrend.month)}
              </p>
              <p className="text-sm text-slate-600">
                Masuk {formatAmount(latestTrend.totalIncoming)} dan keluar {formatAmount(latestTrend.totalOutgoing)}.
              </p>
              <span
                className={`inline-flex w-fit rounded-full px-3 py-1 text-sm font-medium ${getNetFlowSummary(latestTrend.netFlow).tone}`}
              >
                Arus bersih {formatAmount(latestTrend.netFlow)}
              </span>
            </>
          ) : (
            <p className="text-sm text-slate-500">Belum ada data tren bulanan.</p>
          )}
        </SectionCard>

        <SectionCard className="space-y-2">
          <p className="text-sm font-medium text-slate-500">Pengeluaran terbesar</p>
          {topOutgoingCategory ? (
            <>
              <p className="text-xl font-semibold tracking-tight text-slate-900">
                {topOutgoingCategory.categoryName}
              </p>
              <p className="text-sm text-slate-600">
                Menyumbang {topOutgoingCategory.share.toFixed(1)}% dari total pengeluaran periode ini.
              </p>
              <span className="inline-flex w-fit rounded-full bg-rose-50 px-3 py-1 text-sm font-medium text-rose-700">
                {formatAmount(topOutgoingCategory.totalAmount)}
              </span>
            </>
          ) : (
            <p className="text-sm text-slate-500">Belum ada kategori pengeluaran yang bisa disorot.</p>
          )}
        </SectionCard>

        <SectionCard className="space-y-2">
          <p className="text-sm font-medium text-slate-500">Wallet terkuat</p>
          {largestWallet ? (
            <>
              <p className="text-xl font-semibold tracking-tight text-slate-900">
                {largestWallet.name}
              </p>
              <p className="text-sm text-slate-600">
                Saldo paling besar di antara wallet aktif saat ini.
              </p>
              <span className="inline-flex w-fit rounded-full bg-sky-50 px-3 py-1 text-sm font-medium text-sky-700">
                {formatAmount(largestWallet.balance)}
              </span>
            </>
          ) : (
            <p className="text-sm text-slate-500">Belum ada wallet aktif yang bisa dibandingkan.</p>
          )}
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <SectionCard className="space-y-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-500">Kesehatan keuangan</p>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
              Skor saat ini
            </h2>
          </div>

          {healthErrorMessage ? (
            <ErrorState
              title="Skor belum bisa dimuat"
              message={healthErrorMessage}
              actionLabel="Coba lagi"
              onAction={loadDashboard}
            />
          ) : !healthReport ? (
            <EmptyState
              title="Skor belum tersedia"
              message="Saat data keuangan sudah cukup, skor kesehatan akan muncul di sini."
            />
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-4xl font-semibold tracking-tight text-slate-900">
                    {healthReport.score}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {healthReport.summary}
                  </p>
                </div>
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${getHealthStatusTone(healthReport.status)}`}
                >
                  {getHealthStatusLabel(healthReport.status)}
                </span>
              </div>

              {healthReport.recommendations?.length ? (
                <div className="space-y-2">
                  {healthReport.recommendations.slice(0, 3).map((item) => (
                    <div key={item} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                      {item}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          )}
        </SectionCard>

        <SectionCard className="space-y-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-500">Tren bulanan</p>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
              Pergerakan masuk dan keluar
            </h2>
          </div>

          {monthlyTrend.length ? (
            <TrendBarChart items={monthlyTrend} />
          ) : (
            <EmptyState
              title="Tren bulanan belum ada"
              message="Saat mutasi sudah cukup terkumpul, tren bulanan akan muncul di sini."
            />
          )}
        </SectionCard>

        <SectionCard className="space-y-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-500">Kategori pengeluaran</p>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
              Breakdown pengeluaran
            </h2>
          </div>

          {outgoingCategories.length ? (
            <CategoryBreakdownChart items={outgoingCategories} />
          ) : (
            <EmptyState
              title="Kategori pengeluaran belum ada"
              message="Saat pengeluaran sudah dikategorikan, breakdown-nya akan muncul di sini."
            />
          )}
        </SectionCard>
      </div>
    </PageContainer>
  )
}

export default DashboardPage
