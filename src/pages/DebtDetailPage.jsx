import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ErrorState from '../components/feedback/ErrorState.jsx'
import LoadingState from '../components/feedback/LoadingState.jsx'
import PageContainer from '../components/layout/PageContainer.jsx'
import SectionCard from '../components/layout/SectionCard.jsx'
import DebtForm from '../features/debts/DebtForm.jsx'
import { getTenorUnitLabel } from '../features/debts/debt-constants.js'
import { getDebtById, inactivateDebt, updateDebt } from '../features/debts/debt-service.js'
import { createDebtFormFromItem, getDebtStatusLabel, getDebtStatusTone } from '../features/debts/debt-utils.js'
import { formatAmount } from '../utils/format-number.js'

function DebtDetailPage() {
  const { debtId } = useParams()
  const navigate = useNavigate()
  const [debt, setDebt] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [form, setForm] = useState(createDebtFormFromItem())
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isInactivating, setIsInactivating] = useState(false)

  const loadDebt = useCallback(async () => {
    try {
      setIsLoading(true)
      setErrorMessage('')

      const result = await getDebtById(debtId)
      setDebt(result)
      setForm(createDebtFormFromItem(result))
    } catch (error) {
      setErrorMessage(error.message || 'Gagal memuat detail debt.')
    } finally {
      setIsLoading(false)
    }
  }, [debtId])

  useEffect(() => {
    loadDebt()
  }, [loadDebt])

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
      nextErrors.name = 'Nama debt wajib diisi.'
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

      const updatedDebt = await updateDebt(debtId, form)
      setDebt(updatedDebt)
      setForm(createDebtFormFromItem(updatedDebt))
      setFormSuccess('Debt berhasil diperbarui.')
    } catch (error) {
      setFormError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setForm(createDebtFormFromItem(debt))
    setErrors({})
    setFormError('')
  }

  const handleInactivate = async () => {
    try {
      setIsInactivating(true)
      setFormError('')
      setFormSuccess('')

      await inactivateDebt(debtId)
      navigate('/app/debts', {
        replace: true,
        state: {
          message: `Debt ${debt.name} berhasil dinonaktifkan.`,
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
          title="Memuat detail debt"
          message="Detail debt dan metadata-nya sedang diambil dari server."
        />
      </PageContainer>
    )
  }

  if (errorMessage || !debt) {
    return (
      <PageContainer className="space-y-6">
        <Link to="/app/debts" className="inline-flex text-sm font-medium text-slate-600 underline">
          Kembali ke daftar debt
        </Link>
        <ErrorState
          title="Detail debt belum bisa dimuat"
          message={errorMessage || 'Debt tidak ditemukan.'}
          actionLabel="Coba lagi"
          onAction={loadDebt}
        />
      </PageContainer>
    )
  }

  const canInactivate = Number(debt.remaining_amount || 0) === 0

  return (
    <PageContainer className="space-y-6">
      <Link to="/app/debts" className="inline-flex text-sm font-medium text-slate-600 underline">
        Kembali ke daftar debt
      </Link>

      {formError ? <ErrorState title="Aksi debt gagal" message={formError} /> : null}

      {formSuccess ? (
        <SectionCard tone="subtle" className="border-emerald-200 bg-emerald-50">
          <p className="text-sm text-emerald-800">{formSuccess}</p>
        </SectionCard>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <SectionCard className="space-y-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{debt.name}</h1>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${getDebtStatusTone(debt.status)}`}
              >
                {getDebtStatusLabel(debt.status)}
              </span>
            </div>
            <p className="text-sm leading-6 text-slate-600">
              Detail debt membantu kamu memeriksa nilai pokok, sisa hutang, dan metadata pendukung
              sebelum mengubah data.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Pokok</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {formatAmount(debt.principal_amount)}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Sisa</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {formatAmount(debt.remaining_amount)}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Tenor</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {debt.tenor_value && debt.tenor_unit
                  ? `${debt.tenor_value} ${getTenorUnitLabel(debt.tenor_unit)}`
                  : 'Belum diatur'}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Cicilan</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {debt.payment_amount ? formatAmount(debt.payment_amount) : 'Belum diatur'}
              </p>
            </div>
          </div>

          <SectionCard tone="subtle">
            <p className="text-sm font-medium text-slate-700">Catatan</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {debt.note || 'Belum ada catatan tambahan untuk debt ini.'}
            </p>
          </SectionCard>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleInactivate}
              disabled={!canInactivate || isInactivating}
              className="w-full rounded-xl border border-rose-200 px-4 py-3 text-sm font-medium text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400 sm:w-auto"
            >
              {isInactivating ? 'Memproses...' : 'Nonaktifkan debt'}
            </button>
            <span className="inline-flex items-center rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-500">
              {canInactivate
                ? 'Debt ini bisa dinonaktifkan karena sisa hutangnya nol.'
                : 'Debt hanya bisa dinonaktifkan saat remaining amount sudah nol.'}
            </span>
          </div>
        </SectionCard>

        <DebtForm
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

export default DebtDetailPage
