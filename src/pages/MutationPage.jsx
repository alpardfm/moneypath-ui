import { useCallback, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import EmptyState from '../components/feedback/EmptyState.jsx'
import ErrorState from '../components/feedback/ErrorState.jsx'
import LoadingState from '../components/feedback/LoadingState.jsx'
import SuccessBanner from '../components/feedback/SuccessBanner.jsx'
import FormField from '../components/forms/FormField.jsx'
import PageContainer from '../components/layout/PageContainer.jsx'
import PageHeader from '../components/layout/PageHeader.jsx'
import SectionCard from '../components/layout/SectionCard.jsx'
import { listDebts } from '../features/debts/debt-service.js'
import MutationForm from '../features/mutations/MutationForm.jsx'
import { createMutation, listMutations } from '../features/mutations/mutation-service.js'
import {
  createMutationFilterState,
  createMutationFormFromItem,
  getMutationLabel,
  getMutationTone,
  mutationTypeOptions,
  relatedToDebtFilterOptions,
  sortByOptions,
  sortDirectionOptions,
} from '../features/mutations/mutation-utils.js'
import { sanitizeDigits } from '../utils/sanitize-input.js'
import { listWallets } from '../features/wallets/wallet-service.js'
import { formatAmount } from '../utils/format-number.js'

function MutationPage() {
  const location = useLocation()
  const [mutations, setMutations] = useState([])
  const [meta, setMeta] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [filters, setFilters] = useState(createMutationFilterState())
  const [walletOptions, setWalletOptions] = useState([{ value: '', label: 'Pilih wallet' }])
  const [debtOptions, setDebtOptions] = useState([{ value: '', label: 'Pilih debt' }])
  const [form, setForm] = useState(() => createMutationFormFromItem())
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

  const loadMutations = useCallback(async () => {
    try {
      setIsLoading(true)
      setErrorMessage('')

      const result = await listMutations(filters)
      setMutations(result.items)
      setMeta(result.meta)
    } catch (error) {
      setErrorMessage(error.message || 'Gagal memuat mutasi.')
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  useEffect(() => {
    loadDependencies()
  }, [loadDependencies])

  useEffect(() => {
    loadMutations()
  }, [loadMutations])

  useEffect(() => {
    if (location.state?.message) {
      setFormSuccess(location.state.message)
    }
  }, [location.state])

  const handleFormChange = (event) => {
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

  const handleFilterChange = (event) => {
    const { name, value } = event.target

    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value,
      page: 1,
    }))
  }

  const handlePageChange = (nextPage) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      page: nextPage,
    }))
  }

  const resetForm = () => {
    setForm(createMutationFormFromItem())
    setErrors({})
    setFormError('')
  }

  const validateForm = () => {
    const nextErrors = {}

    if (!form.walletId) {
      nextErrors.walletId = 'Wallet wajib dipilih.'
    }

    if (!form.type) {
      nextErrors.type = 'Tipe mutasi wajib dipilih.'
    }

    if (!String(form.amount).trim()) {
      nextErrors.amount = 'Nominal wajib diisi.'
    }

    if (!form.description.trim()) {
      nextErrors.description = 'Deskripsi wajib diisi.'
    }

    if (!form.happenedAt) {
      nextErrors.happenedAt = 'Tanggal kejadian wajib diisi.'
    }

    if (!form.relatedToDebt) {
      return nextErrors
    }

    if (form.type === 'keluar' && !form.debtId) {
      nextErrors.debtId = 'Mutasi keluar terkait debt wajib memilih debt yang ada.'
    }

    if (form.type === 'masuk' && form.debtMode === 'existing' && !form.debtId) {
      nextErrors.debtId = 'Pilih debt yang ingin ditambah sisanya.'
    }

    if (form.type === 'masuk' && form.debtMode === 'new') {
      if (!form.newDebtName.trim()) {
        nextErrors.newDebtName = 'Nama debt baru wajib diisi.'
      }
      if (!String(form.newDebtPrincipalAmount).trim()) {
        nextErrors.newDebtPrincipalAmount = 'Nominal pokok debt baru wajib diisi.'
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

      await createMutation(form)
      resetForm()
      setFormSuccess('Mutasi baru berhasil dibuat.')
      await Promise.all([loadMutations(), loadDependencies()])
    } catch (error) {
      setFormError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <PageContainer className="space-y-6">
      <PageHeader eyebrow="Mutasi" title="Mutasi uang." />

      {formError ? <ErrorState title="Aksi mutasi gagal" message={formError} /> : null}

      <SuccessBanner message={formSuccess} />

      <SectionCard className="space-y-4">
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-500">Filter dan navigasi halaman</p>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            Saring riwayat mutasi
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <FormField id="type" label="Tipe" value={filters.type} onChange={handleFilterChange} options={mutationTypeOptions} />
          <FormField id="walletId" label="Wallet" value={filters.walletId} onChange={handleFilterChange} options={walletOptions} />
          <FormField id="debtId" label="Debt" value={filters.debtId} onChange={handleFilterChange} options={debtOptions} />
          <FormField
            id="relatedToDebt"
            label="Relasi debt"
            value={filters.relatedToDebt}
            onChange={handleFilterChange}
            options={relatedToDebtFilterOptions}
          />
          <FormField id="from" label="Dari" type="datetime-local" value={filters.from} onChange={handleFilterChange} />
          <FormField id="to" label="Sampai" type="datetime-local" value={filters.to} onChange={handleFilterChange} />
          <FormField id="sortBy" label="Urutkan berdasarkan" value={filters.sortBy} onChange={handleFilterChange} options={sortByOptions} />
          <FormField
            id="sortDirection"
            label="Arah urutan"
            value={filters.sortDirection}
            onChange={handleFilterChange}
            options={sortDirectionOptions}
          />
        </div>
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="space-y-4">
          {isLoading ? (
            <LoadingState
              title="Memuat mutasi"
              message="Riwayat mutasi sedang diambil dari server."
            />
          ) : errorMessage ? (
            <ErrorState
              title="Mutasi belum bisa dimuat"
              message={errorMessage}
              actionLabel="Coba lagi"
              onAction={loadMutations}
            />
          ) : mutations.length === 0 ? (
            <EmptyState
              title="Belum ada mutasi"
              message="Setelah mutasi pertama dibuat, riwayat masuk dan keluar akan tampil di sini."
            />
          ) : (
            <>
              <SectionCard className="space-y-3">
                <p className="text-sm font-medium text-slate-500">Riwayat mutasi</p>
                <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                  {meta?.total_items || mutations.length} mutasi ditemukan
                </h2>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    disabled={(filters.page || 1) <= 1}
                    onClick={() => handlePageChange((filters.page || 1) - 1)}
                    className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-400"
                  >
                    Sebelumnya
                  </button>
                  <span className="text-sm text-slate-500">
                    Halaman {filters.page}
                  </span>
                  <button
                    type="button"
                    disabled={!meta || filters.page >= Math.ceil((meta.total_items || 0) / (meta.page_size || filters.pageSize || 10))}
                    onClick={() => handlePageChange(filters.page + 1)}
                    className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-400"
                  >
                    Berikutnya
                  </button>
                </div>
              </SectionCard>

              <div className="space-y-4">
                {mutations.map((mutation) => (
                  <SectionCard key={mutation.id} className="space-y-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getMutationTone(mutation.type)}`}>
                            {getMutationLabel(mutation.type)}
                          </span>
                          {mutation.related_to_debt ? (
                            <span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700">
                              Terkait debt
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-3 text-lg font-semibold text-slate-900">
                          {formatAmount(mutation.amount)}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">{mutation.description}</p>
                        <p className="mt-1 text-sm text-slate-500">
                          {new Date(mutation.happened_at).toLocaleString('id-ID')}
                        </p>
                      </div>

                      <Link
                        to={`/app/mutations/${mutation.id}`}
                        className="inline-flex rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                      >
                        Edit
                      </Link>
                    </div>
                  </SectionCard>
                ))}
              </div>
            </>
          )}
        </section>

        <MutationForm
          mode="create"
          form={form}
          errors={errors}
          isSubmitting={isSubmitting}
          walletOptions={walletOptions}
          debtOptions={debtOptions}
          onChange={handleFormChange}
          onSubmit={handleSubmit}
        />
      </div>
    </PageContainer>
  )
}

export default MutationPage
