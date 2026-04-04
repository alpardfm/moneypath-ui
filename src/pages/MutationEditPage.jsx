import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ErrorState from '../components/feedback/ErrorState.jsx'
import LoadingState from '../components/feedback/LoadingState.jsx'
import PageContainer from '../components/layout/PageContainer.jsx'
import SectionCard from '../components/layout/SectionCard.jsx'
import { getDebtById, listDebts } from '../features/debts/debt-service.js'
import MutationForm from '../features/mutations/MutationForm.jsx'
import { getMutationById, updateMutation } from '../features/mutations/mutation-service.js'
import {
  createMutationFormFromItem,
  getMutationLabel,
  getMutationTone,
} from '../features/mutations/mutation-utils.js'
import { sanitizeDigits } from '../utils/sanitize-input.js'
import { listWallets } from '../features/wallets/wallet-service.js'
import { formatAmount } from '../utils/format-number.js'

function MutationEditPage() {
  const { mutationId } = useParams()
  const navigate = useNavigate()
  const [mutation, setMutation] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [walletOptions, setWalletOptions] = useState([{ value: '', label: 'Pilih wallet' }])
  const [debtOptions, setDebtOptions] = useState([{ value: '', label: 'Pilih debt' }])
  const [form, setForm] = useState(createMutationFormFromItem())
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadDependencies = useCallback(async () => {
    const [walletResult, debtResult] = await Promise.all([
      listWallets({ page: 1, pageSize: 100 }),
      listDebts({ page: 1, pageSize: 100 }),
    ])

    setWalletOptions([
      { value: '', label: 'Pilih wallet' },
      ...walletResult.items.map((wallet) => ({
        value: wallet.id,
        label: `${wallet.name} (${formatAmount(wallet.balance)})`,
      })),
    ])

    setDebtOptions([
      { value: '', label: 'Pilih debt' },
      ...debtResult.items.map((debt) => ({
        value: debt.id,
        label: `${debt.name} - sisa ${formatAmount(debt.remaining_amount)}`,
      })),
    ])
  }, [])

  const loadMutation = useCallback(async () => {
    try {
      setIsLoading(true)
      setErrorMessage('')

      const result = await getMutationById(mutationId)
      const nextForm = createMutationFormFromItem(result)

      if (result?.debt_action === 'borrow_new' && result.debt_id) {
        const relatedDebt = await getDebtById(result.debt_id)
        nextForm.newDebtName = relatedDebt?.name || ''
        nextForm.newDebtPrincipalAmount = relatedDebt?.principal_amount || ''
        nextForm.newDebtTenorValue = relatedDebt?.tenor_value ?? ''
        nextForm.newDebtTenorUnit = relatedDebt?.tenor_unit || ''
        nextForm.newDebtPaymentAmount = relatedDebt?.payment_amount || ''
        nextForm.newDebtNote = relatedDebt?.note || ''
      }

      setMutation(result)
      setForm(nextForm)
    } catch (error) {
      setErrorMessage(error.message || 'Gagal memuat detail mutasi.')
    } finally {
      setIsLoading(false)
    }
  }, [mutationId])

  useEffect(() => {
    loadDependencies()
    loadMutation()
  }, [loadDependencies, loadMutation])

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    const numberOnlyFields = ['amount', 'newDebtPrincipalAmount', 'newDebtPaymentAmount']
    const nextValue =
      type === 'checkbox' ? checked : numberOnlyFields.includes(name) ? sanitizeDigits(value) : value

    setForm((currentForm) => {
      const nextForm = {
        ...currentForm,
        [name]: nextValue,
      }

      if (name === 'type' && value === 'keluar') {
        nextForm.debtMode = 'existing'
      }

      if (name === 'relatedToDebt' && !checked) {
        nextForm.debtId = ''
        nextForm.debtMode = 'existing'
        nextForm.newDebtName = ''
        nextForm.newDebtPrincipalAmount = ''
        nextForm.newDebtTenorValue = ''
        nextForm.newDebtTenorUnit = ''
        nextForm.newDebtPaymentAmount = ''
        nextForm.newDebtNote = ''
      }

      if (name === 'debtMode' && value === 'existing') {
        nextForm.newDebtName = ''
        nextForm.newDebtPrincipalAmount = ''
        nextForm.newDebtTenorValue = ''
        nextForm.newDebtTenorUnit = ''
        nextForm.newDebtPaymentAmount = ''
        nextForm.newDebtNote = ''
      }

      if (name === 'debtMode' && value === 'new') {
        nextForm.debtId = ''
      }

      return nextForm
    })

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: '',
    }))
  }

  const validateForm = () => {
    const nextErrors = {}

    if (!form.walletId) nextErrors.walletId = 'Wallet wajib dipilih.'
    if (!form.type) nextErrors.type = 'Tipe mutasi wajib dipilih.'
    if (!String(form.amount).trim()) nextErrors.amount = 'Nominal wajib diisi.'
    if (!form.description.trim()) nextErrors.description = 'Deskripsi wajib diisi.'
    if (!form.happenedAt) nextErrors.happenedAt = 'Tanggal kejadian wajib diisi.'

    if (form.relatedToDebt) {
      if (form.type === 'keluar' && !form.debtId) nextErrors.debtId = 'Pilih debt yang ada.'
      if (form.type === 'masuk' && form.debtMode === 'existing' && !form.debtId) {
        nextErrors.debtId = 'Pilih debt yang ingin ditambah sisanya.'
      }
      if (form.type === 'masuk' && form.debtMode === 'new') {
        if (!form.newDebtName.trim()) nextErrors.newDebtName = 'Nama debt baru wajib diisi.'
        if (!String(form.newDebtPrincipalAmount).trim()) {
          nextErrors.newDebtPrincipalAmount = 'Nominal pokok debt baru wajib diisi.'
        }
      }
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

      const updatedMutation = await updateMutation(mutationId, form)
      setMutation(updatedMutation)
      setForm(createMutationFormFromItem(updatedMutation))
      setFormSuccess('Mutasi berhasil diperbarui.')
      await loadDependencies()
    } catch (error) {
      setFormError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setForm(createMutationFormFromItem(mutation))
    setErrors({})
    setFormError('')
  }

  if (isLoading) {
    return (
      <PageContainer>
        <LoadingState
          title="Memuat detail mutasi"
          message="Data mutasi sedang diambil dari server."
        />
      </PageContainer>
    )
  }

  if (errorMessage || !mutation) {
    return (
      <PageContainer className="space-y-6">
        <Link to="/app/mutations" className="inline-flex text-sm font-medium text-slate-600 underline">
          Kembali ke daftar mutasi
        </Link>
        <ErrorState
          title="Detail mutasi belum bisa dimuat"
          message={errorMessage || 'Mutasi tidak ditemukan.'}
          actionLabel="Coba lagi"
          onAction={loadMutation}
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/app/mutations" className="inline-flex text-sm font-medium text-slate-600 underline">
          Kembali ke daftar mutasi
        </Link>
        <button
          type="button"
          onClick={() =>
            navigate('/app/mutations', {
              replace: true,
              state: { message: 'Delete mutation memang tidak tersedia di UI sesuai aturan produk.' },
            })
          }
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-500"
        >
          Delete tidak tersedia
        </button>
      </div>

      {formError ? <ErrorState title="Aksi mutasi gagal" message={formError} /> : null}

      {formSuccess ? (
        <SectionCard tone="subtle" className="border-emerald-200 bg-emerald-50">
          <p className="text-sm text-emerald-800">{formSuccess}</p>
        </SectionCard>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <SectionCard className="space-y-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${getMutationTone(mutation.type)}`}>
                {getMutationLabel(mutation.type)}
              </span>
              {mutation.related_to_debt ? (
                <span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-sm font-medium text-sky-700">
                  Debt linked
                </span>
              ) : null}
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              {formatAmount(mutation.amount)}
            </h1>
            <p className="text-sm leading-6 text-slate-600">{mutation.description}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Wallet ID</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">{mutation.wallet_id}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Debt ID</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">{mutation.debt_id || '-'}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Debt action</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">{mutation.debt_action || 'none'}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Happened at</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">
                {new Date(mutation.happened_at).toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        </SectionCard>

        <MutationForm
          mode="edit"
          form={form}
          errors={errors}
          isSubmitting={isSubmitting}
          walletOptions={walletOptions}
          debtOptions={debtOptions}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={handleReset}
        />
      </div>
    </PageContainer>
  )
}

export default MutationEditPage
