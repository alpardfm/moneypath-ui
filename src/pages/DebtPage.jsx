import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import EmptyState from '../components/feedback/EmptyState.jsx'
import ErrorState from '../components/feedback/ErrorState.jsx'
import LoadingState from '../components/feedback/LoadingState.jsx'
import PageContainer from '../components/layout/PageContainer.jsx'
import SectionCard from '../components/layout/SectionCard.jsx'
import DebtForm from '../features/debts/DebtForm.jsx'
import { createDebt, listDebts } from '../features/debts/debt-service.js'
import { createDebtFormFromItem, getDebtStatusLabel, getDebtStatusTone } from '../features/debts/debt-utils.js'
import { formatAmount } from '../utils/format-number.js'

const initialForm = createDebtFormFromItem()

function DebtPage() {
  const location = useLocation()
  const [debts, setDebts] = useState([])
  const [meta, setMeta] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadDebts = async () => {
    try {
      setIsLoading(true)
      setErrorMessage('')

      const result = await listDebts({ page: 1, pageSize: 20 })
      setDebts(result.items)
      setMeta(result.meta)
    } catch (error) {
      setErrorMessage(error.message || 'Gagal memuat debt.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadDebts()
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

  const validateForm = () => {
    const nextErrors = {}

    if (!form.name.trim()) {
      nextErrors.name = 'Nama debt wajib diisi.'
    }

    if (!String(form.principalAmount).trim()) {
      nextErrors.principalAmount = 'Nominal pokok wajib diisi.'
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

      const createdDebt = await createDebt(form)
      setDebts((currentDebts) => [createdDebt, ...currentDebts])
      setForm(initialForm)
      setErrors({})
      setFormSuccess('Debt baru berhasil dibuat.')

      if (meta) {
        setMeta({
          ...meta,
          total_items: (meta.total_items || 0) + 1,
        })
      }
    } catch (error) {
      setFormError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <PageContainer className="space-y-6">
      <div className="space-y-3">
        <p className="text-sm font-medium text-slate-500">Debts</p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Kelola daftar hutang dengan tampilan yang jelas.
        </h1>
        <p className="max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
          Di phase ini kamu bisa melihat daftar debt, membuat debt baru, membuka detail debt, dan
          memperbarui metadata debt dari halaman detail.
        </p>
      </div>

      {formError ? <ErrorState title="Aksi debt gagal" message={formError} /> : null}

      {formSuccess ? (
        <SectionCard tone="subtle" className="border-emerald-200 bg-emerald-50">
          <p className="text-sm text-emerald-800">{formSuccess}</p>
        </SectionCard>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="space-y-4">
          {isLoading ? (
            <LoadingState
              title="Memuat debt"
              message="Daftar debt sedang diambil dari server."
            />
          ) : errorMessage ? (
            <ErrorState
              title="Debt belum bisa dimuat"
              message={errorMessage}
              actionLabel="Coba lagi"
              onAction={loadDebts}
            />
          ) : debts.length === 0 ? (
            <EmptyState
              title="Belum ada debt"
              message="Buat debt pertama agar sisa hutang dan statusnya bisa dipantau dari aplikasi."
            />
          ) : (
            <>
              <SectionCard className="space-y-2">
                <p className="text-sm font-medium text-slate-500">Debt list</p>
                <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                  {meta?.total_items || debts.length} debt aktif
                </h2>
                <p className="text-sm leading-6 text-slate-600">
                  Status debt diturunkan dari backend: `active`, `lunas`, atau `inactive`.
                </p>
              </SectionCard>

              <div className="space-y-4">
                {debts.map((debt) => (
                  <SectionCard key={debt.id} className="space-y-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate text-lg font-semibold text-slate-900">
                            {debt.name}
                          </h3>
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getDebtStatusTone(debt.status)}`}
                          >
                            {getDebtStatusLabel(debt.status)}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-slate-500">
                          Pokok: {formatAmount(debt.principal_amount)}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          Sisa: {formatAmount(debt.remaining_amount)}
                        </p>
                      </div>

                      <Link
                        to={`/app/debts/${debt.id}`}
                        className="inline-flex rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                      >
                        Lihat detail
                      </Link>
                    </div>

                    <p className="text-sm leading-6 text-slate-600">
                      {debt.note || 'Belum ada catatan tambahan untuk debt ini.'}
                    </p>
                  </SectionCard>
                ))}
              </div>
            </>
          )}
        </section>

        <DebtForm
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

export default DebtPage
