import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import EmptyState from '../components/feedback/EmptyState.jsx'
import ErrorState from '../components/feedback/ErrorState.jsx'
import LoadingState from '../components/feedback/LoadingState.jsx'
import PageContainer from '../components/layout/PageContainer.jsx'
import SectionCard from '../components/layout/SectionCard.jsx'
import DebtForm from '../features/debts/DebtForm.jsx'
import { getTenorUnitLabel } from '../features/debts/debt-constants.js'
import { getDebtById, inactivateDebt, updateDebt } from '../features/debts/debt-service.js'
import { createDebtFormFromItem, getDebtStatusLabel, getDebtStatusTone } from '../features/debts/debt-utils.js'
import { getMutationLabel, getMutationTone } from '../features/mutations/mutation-utils.js'
import { listMutations } from '../features/mutations/mutation-service.js'
import { formatAmount } from '../utils/format-number.js'
import { sanitizeDigits } from '../utils/sanitize-input.js'

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
  const [relatedMutations, setRelatedMutations] = useState([])
  const [isHistoryLoading, setIsHistoryLoading] = useState(true)
  const [historyError, setHistoryError] = useState('')

  const loadRelatedMutations = useCallback(async () => {
    try {
      setIsHistoryLoading(true)
      setHistoryError('')

      const result = await listMutations({
        debtId,
        page: 1,
        pageSize: 10,
        sortBy: 'happened_at',
        sortDirection: 'desc',
      })

      setRelatedMutations(result.items)
    } catch (error) {
      setHistoryError(error.message || 'Gagal memuat riwayat mutasi debt.')
    } finally {
      setIsHistoryLoading(false)
    }
  }, [debtId])

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

  useEffect(() => {
    loadRelatedMutations()
  }, [loadRelatedMutations])

  const handleChange = (event) => {
    const { name, value } = event.target
    const numberOnlyFields = ['principalAmount', 'paymentAmount']
    const nextValue = numberOnlyFields.includes(name) ? sanitizeDigits(value) : value

    setForm((currentForm) => ({
      ...currentForm,
      [name]: nextValue,
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
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{debt.name}</h1>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${getDebtStatusTone(debt.status)}`}
              >
                {getDebtStatusLabel(debt.status)}
              </span>
            </div>
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
            {!canInactivate ? (
              <span className="inline-flex items-center rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-500">
                Sisa hutang harus nol.
              </span>
            ) : null}
          </div>

          <SectionCard tone="subtle" className="space-y-4">
            <div>
              <p className="text-sm font-medium text-slate-700">Riwayat mutasi terkait</p>
            </div>

            {isHistoryLoading ? (
              <LoadingState
                title="Memuat riwayat mutasi"
                message="Mutasi terkait debt ini sedang diambil dari server."
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
                title="Belum ada mutasi terkait"
                message="Saat ada mutasi masuk atau keluar yang terhubung ke debt ini, riwayatnya akan muncul di sini."
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
                          <span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700">
                            Terkait debt
                          </span>
                        </div>
                        <p className="mt-3 text-lg font-semibold text-slate-900">
                          {formatAmount(mutation.amount)}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          {mutation.description}
                        </p>
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
