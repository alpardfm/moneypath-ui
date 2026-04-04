import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import EmptyState from '../components/feedback/EmptyState.jsx'
import ErrorState from '../components/feedback/ErrorState.jsx'
import LoadingState from '../components/feedback/LoadingState.jsx'
import PageContainer from '../components/layout/PageContainer.jsx'
import SectionCard from '../components/layout/SectionCard.jsx'
import { createWallet, inactivateWallet, listWallets } from '../features/wallets/wallet-service.js'
import WalletForm from '../features/wallets/WalletForm.jsx'
import { formatAmount } from '../utils/format-number.js'

const initialForm = {
  name: '',
}

function WalletPage() {
  const location = useLocation()
  const [wallets, setWallets] = useState([])
  const [meta, setMeta] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [inactivatingWalletID, setInactivatingWalletID] = useState('')

  const loadWallets = async () => {
    try {
      setIsLoading(true)
      setErrorMessage('')

      const result = await listWallets({ page: 1, pageSize: 20 })
      setWallets(result.items)
      setMeta(result.meta)
    } catch (error) {
      setErrorMessage(error.message || 'Gagal memuat wallet.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadWallets()
  }, [])

  useEffect(() => {
    if (location.state?.message) {
      setFormSuccess(location.state.message)
    }
  }, [location.state])

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

  const resetFormState = () => {
    setForm(initialForm)
    setErrors({})
    setFormError('')
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

      const newWallet = await createWallet(form)
      setWallets((currentWallets) => [newWallet, ...currentWallets])
      setFormSuccess('Wallet baru berhasil dibuat.')
      if (meta) {
        setMeta({
          ...meta,
          total_items: (meta.total_items || 0) + 1,
        })
      }

      resetFormState()
    } catch (error) {
      setFormError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInactivate = async (wallet) => {
    try {
      setInactivatingWalletID(wallet.id)
      setFormError('')
      setFormSuccess('')

      await inactivateWallet(wallet.id)
      setWallets((currentWallets) => currentWallets.filter((item) => item.id !== wallet.id))
      setFormSuccess(`Wallet ${wallet.name} berhasil dinonaktifkan.`)
      if (meta) {
        setMeta({
          ...meta,
          total_items: Math.max((meta.total_items || wallets.length) - 1, 0),
        })
      }
    } catch (error) {
      setFormError(error.message)
    } finally {
      setInactivatingWalletID('')
    }
  }

  return (
    <PageContainer className="space-y-6">
      <div className="space-y-3">
        <p className="text-sm font-medium text-slate-500">Wallets</p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Kelola wallet aktif dengan alur yang sederhana.
        </h1>
        <p className="max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
          Wallet dipakai sebagai sumber penyimpanan uang. Di fase ini kamu bisa melihat wallet aktif,
          menambah wallet baru, mengganti nama wallet, dan menonaktifkan wallet dengan saldo nol.
        </p>
      </div>

      {formError ? <ErrorState title="Aksi wallet gagal" message={formError} /> : null}

      {formSuccess ? (
        <SectionCard tone="subtle" className="border-emerald-200 bg-emerald-50">
          <p className="text-sm text-emerald-800">{formSuccess}</p>
        </SectionCard>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="space-y-4">
          {isLoading ? (
            <LoadingState
              title="Memuat wallet"
              message="Daftar wallet aktif sedang diambil dari server."
            />
          ) : errorMessage ? (
            <ErrorState
              title="Wallet belum bisa dimuat"
              message={errorMessage}
              actionLabel="Coba lagi"
              onAction={loadWallets}
            />
          ) : wallets.length === 0 ? (
            <EmptyState
              title="Belum ada wallet aktif"
              message="Buat wallet pertama agar nanti bisa dipakai di dashboard dan mutasi."
            />
          ) : (
            <>
              <SectionCard className="space-y-2">
                <p className="text-sm font-medium text-slate-500">Active wallets</p>
                <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                  {meta?.total_items || wallets.length} wallet aktif
                </h2>
                <p className="text-sm leading-6 text-slate-600">
                  Wallet aktif akan muncul sebagai pilihan pada flow mutasi. Wallet dengan saldo
                  bukan nol tidak bisa dinonaktifkan.
                </p>
              </SectionCard>

              <div className="space-y-4">
                {wallets.map((wallet) => {
                  const hasBalance = Number(wallet.balance || 0) !== 0

                  return (
                    <SectionCard key={wallet.id} className="space-y-4">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="truncate text-lg font-semibold text-slate-900">
                              {wallet.name}
                            </h3>
                            <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                              Active
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-slate-500">
                            Balance: {formatAmount(wallet.balance)}
                          </p>
                        </div>

                        <div className="flex flex-col gap-2 sm:w-auto sm:items-end">
                          <Link
                            to={`/app/wallets/${wallet.id}`}
                            className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                          >
                            Lihat detail
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleInactivate(wallet)}
                            disabled={hasBalance || inactivatingWalletID === wallet.id}
                            className="rounded-xl border border-rose-200 px-4 py-2.5 text-sm font-medium text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
                          >
                            {inactivatingWalletID === wallet.id ? 'Memproses...' : 'Nonaktifkan'}
                          </button>
                        </div>
                      </div>

                      <p className="text-sm leading-6 text-slate-600">
                        {hasBalance
                          ? 'Wallet ini belum bisa dinonaktifkan karena balance belum nol.'
                          : 'Wallet ini bisa dinonaktifkan bila memang tidak ingin dipakai lagi.'}
                      </p>
                    </SectionCard>
                  )
                })}
              </div>
            </>
          )}
        </section>

        <WalletForm
          mode="create"
          form={form}
          errors={errors}
          isSubmitting={isSubmitting}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      </div>
    </PageContainer>
  )
}

export default WalletPage
