import { useEffect, useState } from 'react'
import EmptyState from '../components/feedback/EmptyState.jsx'
import ErrorState from '../components/feedback/ErrorState.jsx'
import LoadingState from '../components/feedback/LoadingState.jsx'
import PageContainer from '../components/layout/PageContainer.jsx'
import SectionCard from '../components/layout/SectionCard.jsx'
import { getDashboardOverview } from '../features/dashboard/dashboard-service.js'
import { formatAmount } from '../utils/format-number.js'

const metricCards = [
  {
    key: 'total_assets',
    label: 'Total assets',
    valueKey: 'total_assets',
    tone: 'bg-emerald-50 text-emerald-700',
  },
  {
    key: 'total_debts',
    label: 'Total debts',
    valueKey: 'total_debts',
    tone: 'bg-rose-50 text-rose-700',
  },
  {
    key: 'total_incoming',
    label: 'Total incoming',
    valueKey: 'total_incoming',
    tone: 'bg-sky-50 text-sky-700',
  },
  {
    key: 'total_outgoing',
    label: 'Total outgoing',
    valueKey: 'total_outgoing',
    tone: 'bg-amber-50 text-amber-700',
  },
]

function DashboardPage() {
  const [dashboard, setDashboard] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  const loadDashboard = async () => {
    try {
      setIsLoading(true)
      setErrorMessage('')

      const overview = await getDashboardOverview()
      setDashboard(overview)
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
        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-500">Dashboard</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Menyiapkan ringkasan keuangan kamu.
          </h1>
        </div>
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
        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-500">Dashboard</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Dashboard belum bisa dimuat.
          </h1>
        </div>
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
        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-500">Dashboard</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Belum ada data dashboard.
          </h1>
        </div>
        <EmptyState
          title="Dashboard masih kosong"
          message="Pastikan akun kamu sudah punya wallet atau mutasi agar ringkasan bisa ditampilkan."
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer className="space-y-6">
      <div className="space-y-3">
        <p className="text-sm font-medium text-slate-500">Dashboard</p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Ringkasan keuangan harian yang mudah dipindai.
        </h1>
        <p className="max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
          Dashboard ini menampilkan total aset, total utang, arus masuk, arus keluar, dan saldo
          wallet aktif langsung dari backend.
        </p>
      </div>

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
        <SectionCard className="space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-500">Net flow</p>
              <h2 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
                {formatAmount(dashboard.net_flow)}
              </h2>
            </div>
            <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
              {dashboard.wallets?.length || 0} wallet aktif
            </span>
          </div>
          <p className="text-sm leading-6 text-slate-600">
            Nilai ini dihitung dari total mutasi masuk dikurangi total mutasi keluar. Tampilan ini
            dibuat sederhana supaya cepat dibaca di desktop maupun mobile.
          </p>
        </SectionCard>

        {dashboard.wallets?.length ? (
          <SectionCard className="space-y-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Wallet balances</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
                Saldo wallet aktif
              </h2>
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
    </PageContainer>
  )
}

export default DashboardPage
