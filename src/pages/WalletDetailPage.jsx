import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import EmptyState from '../components/feedback/EmptyState.jsx'
import ErrorState from '../components/feedback/ErrorState.jsx'
import LoadingState from '../components/feedback/LoadingState.jsx'
import PageContainer from '../components/layout/PageContainer.jsx'
import SectionCard from '../components/layout/SectionCard.jsx'
import { getMutationLabel, getMutationTone } from '../features/mutations/mutation-utils.js'
import { listMutations } from '../features/mutations/mutation-service.js'
import WalletForm from '../features/wallets/WalletForm.jsx'
import { getWalletById, inactivateWallet, updateWallet } from '../features/wallets/wallet-service.js'
import { formatAmount } from '../utils/format-number.js'

function WalletDetailPage() {
  const { walletId } = useParams()
  const navigate = useNavigate()
  const [wallet, setWallet] = useState(null)
  const [form, setForm] = useState({ name: '' })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isInactivating, setIsInactivating] = useState(false)
  const [relatedMutations, setRelatedMutations] = useState([])
  const [isHistoryLoading, setIsHistoryLoading] = useState(true)
  const [historyError, setHistoryError] = useState('')

  const loadWallet = useCallback(async () => {
    try {
      setIsLoading(true)
      setErrorMessage('')

      const result = await getWalletById(walletId)
      setWallet(result)
      setForm({ name: result?.name || '' })
    } catch (error) {
      setErrorMessage(error.message || 'Gagal memuat detail wallet.')
    } finally {
      setIsLoading(false)
    }
  }, [walletId])

  const loadRelatedMutations = useCallback(async () => {
    try {
      setIsHistoryLoading(true)
      setHistoryError('')

      const result = await listMutations({
        walletId,
        page: 1,
        pageSize: 10,
        sortBy: 'happened_at',
        sortDirection: 'desc',
      })

      setRelatedMutations(result.items)
    } catch (error) {
      setHistoryError(error.message || 'Gagal memuat riwayat mutasi wallet.')
    } finally {
      setIsHistoryLoading(false)
    }
  }, [walletId])

  useEffect(() => {
    loadWallet()
    loadRelatedMutations()
  }, [loadRelatedMutations, loadWallet])

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: '',
    }))
  }

  const validateForm = () => {
    const nextErrors = {}

    if (!form.name.trim()) {
      nextErrors.name = 'Nama wallet wajib diisi.'
    }

    return nextErrors
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const nextErrors = validateForm()
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    try {
      setIsSubmitting(true)
      setFormError('')
      setFormSuccess('')

      const updatedWallet = await updateWallet(walletId, form)
      setWallet(updatedWallet)
      setForm({ name: updatedWallet?.name || '' })
      setFormSuccess('Nama wallet berhasil diperbarui.')
    } catch (error) {
      setFormError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setForm({ name: wallet?.name || '' })
    setErrors({})
    setFormError('')
  }

  const handleInactivate = async () => {
    try {
      setIsInactivating(true)
      setFormError('')
      setFormSuccess('')

      await inactivateWallet(walletId)
      navigate('/app/wallets', {
        replace: true,
        state: {
          message: `Wallet ${wallet.name} berhasil dinonaktifkan.`,
        },
      })
    } catch (error) {
      setFormError(error.message)
    } finally {
      setIsInactivating(false)
    }
  }

  if (isLoading) {
    return (
      <PageContainer>
        <LoadingState
          title="Memuat detail wallet"
          message="Detail wallet sedang diambil dari server."
        />
      </PageContainer>
    )
  }

  if (errorMessage || !wallet) {
    return (
      <PageContainer className="space-y-6">
        <Link to="/app/wallets" className="inline-flex text-sm font-medium text-slate-600 underline">
          Kembali ke daftar wallet
        </Link>
        <ErrorState
          title="Detail wallet belum bisa dimuat"
          message={errorMessage || 'Wallet tidak ditemukan.'}
          actionLabel="Coba lagi"
          onAction={loadWallet}
        />
      </PageContainer>
    )
  }

  const hasBalance = Number(wallet.balance || 0) !== 0

  return (
    <PageContainer className="space-y-6">
      <Link to="/app/wallets" className="inline-flex text-sm font-medium text-slate-600 underline">
        Kembali ke daftar wallet
      </Link>

      {formError ? <ErrorState title="Aksi wallet gagal" message={formError} /> : null}

      {formSuccess ? (
        <SectionCard tone="subtle" className="border-emerald-200 bg-emerald-50">
          <p className="text-sm text-emerald-800">{formSuccess}</p>
        </SectionCard>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <SectionCard className="space-y-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{wallet.name}</h1>
              <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
                Active
              </span>
            </div>
            <p className="text-sm leading-6 text-slate-600">
              Detail wallet membantu kamu melihat saldo terkini dan riwayat mutasi tanpa pindah ke
              halaman mutation.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 px-4 py-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Balance</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{formatAmount(wallet.balance)}</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleInactivate}
              disabled={hasBalance || isInactivating}
              className="w-full rounded-xl border border-rose-200 px-4 py-3 text-sm font-medium text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400 sm:w-auto"
            >
              {isInactivating ? 'Memproses...' : 'Nonaktifkan wallet'}
            </button>
            <span className="inline-flex items-center rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-500">
              {hasBalance
                ? 'Wallet ini belum bisa dinonaktifkan karena balance belum nol.'
                : 'Wallet ini bisa dinonaktifkan bila memang tidak ingin dipakai lagi.'}
            </span>
          </div>

          <SectionCard tone="subtle" className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-700">Riwayat mutasi wallet</p>
              <p className="text-sm leading-6 text-slate-500">
                Menampilkan mutasi masuk dan keluar yang memakai wallet ini.
              </p>
            </div>

            {isHistoryLoading ? (
              <LoadingState
                title="Memuat riwayat mutasi"
                message="Mutasi wallet ini sedang diambil dari server."
              />
            ) : historyError ? (
              <ErrorState
                title="Riwayat mutasi belum bisa dimuat"
                message={historyError}
                actionLabel="Coba lagi"
                onAction={loadRelatedMutations}
              />
            ) : relatedMutations.length === 0 ? (
              <EmptyState
                title="Belum ada mutasi"
                message="Saat wallet ini dipakai di mutasi masuk atau keluar, riwayatnya akan tampil di sini."
              />
            ) : (
              <div className="space-y-3">
                {relatedMutations.map((mutation) => (
                  <div
                    key={mutation.id}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getMutationTone(mutation.type)}`}
                          >
                            {getMutationLabel(mutation.type)}
                          </span>
                          {mutation.related_to_debt ? (
                            <span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700">
                              Debt linked
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-3 text-lg font-semibold text-slate-900">
                          {formatAmount(mutation.amount)}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">{mutation.description}</p>
                        <p className="mt-1 text-sm text-slate-500">
                          {new Date(mutation.happened_at).toLocaleString('id-ID')}
                        </p>
                      </div>

                      <Link
                        to={`/app/mutations/${mutation.id}`}
                        className="inline-flex rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                      >
                        Lihat mutasi
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </SectionCard>

        <WalletForm
          mode="edit"
          form={form}
          errors={errors}
          isSubmitting={isSubmitting}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={handleReset}
        />
      </div>
    </PageContainer>
  )
}

export default WalletDetailPage
