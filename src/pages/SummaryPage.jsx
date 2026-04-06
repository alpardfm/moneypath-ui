import { useCallback, useEffect, useState } from 'react'
import EmptyState from '../components/feedback/EmptyState.jsx'
import ErrorState from '../components/feedback/ErrorState.jsx'
import LoadingState from '../components/feedback/LoadingState.jsx'
import FormField from '../components/forms/FormField.jsx'
import PageContainer from '../components/layout/PageContainer.jsx'
import PageHeader from '../components/layout/PageHeader.jsx'
import SectionCard from '../components/layout/SectionCard.jsx'
import { getLeakageReport } from '../features/leakage/leakage-service.js'
import {
  getLeakageSeverityLabel,
  getLeakageSeverityTone,
} from '../features/leakage/leakage-utils.js'
import { getSummaryReport } from '../features/summary/summary-service.js'
import {
  createSummaryFilterState,
  getSummaryPeriodLabel,
  isSummaryEmpty,
} from '../features/summary/summary-utils.js'
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

function SummaryPage() {
  const [summary, setSummary] = useState(null)
  const [leakageReport, setLeakageReport] = useState(null)
  const [filters, setFilters] = useState(() => createSummaryFilterState())
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [leakageErrorMessage, setLeakageErrorMessage] = useState('')

  const loadSummary = useCallback(async (nextFilters) => {
    try {
      setIsLoading(true)
      setErrorMessage('')
      setLeakageErrorMessage('')

      const [summaryResult, leakageResult] = await Promise.allSettled([
        getSummaryReport(nextFilters),
        getLeakageReport(30),
      ])

      if (summaryResult.status !== 'fulfilled') {
        throw summaryResult.reason
      }

      setSummary(summaryResult.value)

      if (leakageResult.status === 'fulfilled') {
        setLeakageReport(leakageResult.value)
      } else {
        setLeakageReport(null)
        setLeakageErrorMessage(
          leakageResult.reason?.message || 'Insight kebocoran belum bisa dimuat.',
        )
      }
    } catch (error) {
      setErrorMessage(error.message || 'Gagal memuat ringkasan.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadSummary(createSummaryFilterState())
  }, [loadSummary])

  const handleFilterChange = (event) => {
    const { name, value } = event.target

    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    await loadSummary(filters)
  }

  const handleReset = async () => {
    const nextFilters = createSummaryFilterState()
    setFilters(nextFilters)
    await loadSummary(nextFilters)
  }

  return (
    <PageContainer className="space-y-6">
      <PageHeader eyebrow="Ringkasan" title="Ringkasan periode." />

      <SectionCard className="space-y-4">
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-500">Filter tanggal</p>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            Pilih periode ringkasan
          </h2>
        </div>

        <form className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto_auto]" onSubmit={handleSubmit}>
          <FormField
            id="from"
            label="Dari tanggal"
            type="date"
            value={filters.from}
            onChange={handleFilterChange}
            className="min-w-0"
          />
          <FormField
            id="to"
            label="Sampai tanggal"
            type="date"
            value={filters.to}
            onChange={handleFilterChange}
            className="min-w-0"
          />
          <button
            type="submit"
            className="mt-auto w-full min-w-0 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 lg:w-auto"
          >
            Terapkan
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="mt-auto w-full min-w-0 rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 lg:w-auto"
          >
            Atur ulang
          </button>
        </form>
      </SectionCard>

      {isLoading ? (
        <LoadingState
          title="Memuat ringkasan"
          message="Data ringkasan periode sedang diambil dari server."
        />
      ) : errorMessage ? (
        <ErrorState
          title="Ringkasan belum bisa dimuat"
          message={errorMessage}
          actionLabel="Coba lagi"
          onAction={() => loadSummary(filters)}
        />
      ) : !summary || isSummaryEmpty(summary) ? (
        <EmptyState
          title="Ringkasan masih kosong"
          message="Belum ada data yang cocok dengan periode ini. Coba ubah rentang tanggal atau tambahkan mutasi."
        />
      ) : (
        <>
          <SectionCard className="space-y-3">
            <p className="text-sm font-medium text-slate-500">Periode aktif</p>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                {getSummaryPeriodLabel(summary)}
              </h2>
              <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
                {summary.wallets?.length || 0} wallet aktif
              </span>
            </div>
          </SectionCard>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metricCards.map((item) => (
              <SectionCard key={item.key} className="space-y-3">
                <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${item.tone}`}>
                  {item.label}
                </span>
                <p className="text-3xl font-semibold tracking-tight text-slate-900">
                  {formatAmount(summary[item.valueKey])}
                </p>
              </SectionCard>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <SectionCard className="space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-500">Arus bersih</p>
                  <h2 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
                    {formatAmount(summary.net_flow)}
                  </h2>
                </div>
                <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
                  Ringkasan periode
                </span>
              </div>
              <p className="text-sm leading-6 text-slate-600">
                Nilai ini dihitung dari total mutasi masuk dikurangi total mutasi keluar dalam
                periode yang sedang dipilih.
              </p>
            </SectionCard>

            {summary.wallets?.length ? (
              <SectionCard className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">Saldo wallet</p>
                  <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
                    Saldo wallet aktif
                  </h2>
                </div>
                <div className="space-y-3">
                  {summary.wallets.map((wallet) => (
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
                message="Saat wallet aktif tersedia, daftar saldonya akan muncul di ringkasan ini."
              />
            )}
          </div>

          <SectionCard className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-500">Insight pengeluaran</p>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                Leakage detection 30 hari
              </h2>
            </div>

            {leakageErrorMessage ? (
              <ErrorState
                title="Insight belum bisa dimuat"
                message={leakageErrorMessage}
                actionLabel="Coba lagi"
                onAction={() => loadSummary(filters)}
              />
            ) : !leakageReport ? (
              <EmptyState
                title="Insight belum tersedia"
                message="Saat data pengeluaran sudah cukup, insight kebocoran akan muncul di sini."
              />
            ) : (
              <div className="space-y-4">
                <div className="rounded-2xl bg-slate-50 px-4 py-4">
                  <p className="text-sm font-medium text-slate-500">Total keluar {leakageReport.days} hari</p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
                    {formatAmount(leakageReport.total_outgoing)}
                  </p>
                </div>

                {leakageReport.findings?.length ? (
                  <div className="space-y-3">
                    {leakageReport.findings.map((item, index) => (
                      <div key={`${item.type}-${index}`} className="rounded-2xl bg-slate-50 px-4 py-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="space-y-2">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getLeakageSeverityTone(item.severity)}`}
                            >
                              {getLeakageSeverityLabel(item.severity)}
                            </span>
                            <div>
                              <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                              <p className="mt-1 text-sm leading-6 text-slate-600">{item.summary}</p>
                            </div>
                          </div>
                          <p className="text-sm font-semibold text-slate-900">
                            {formatAmount(item.amount)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="Belum ada temuan kuat"
                    message="Belum ada pola kebocoran pengeluaran yang cukup kuat pada periode ini."
                  />
                )}

                {leakageReport.recommendations?.length ? (
                  <div className="space-y-2">
                    {leakageReport.recommendations.map((item) => (
                      <div key={item} className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-700 ring-1 ring-slate-200">
                        {item}
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            )}
          </SectionCard>
        </>
      )}
    </PageContainer>
  )
}

export default SummaryPage
