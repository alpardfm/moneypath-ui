import FormField from '../../components/forms/FormField.jsx'
import SectionCard from '../../components/layout/SectionCard.jsx'
import { tenorUnitOptions } from './debt-constants.js'

function DebtForm({
  mode = 'create',
  form,
  errors,
  isSubmitting,
  onChange,
  onSubmit,
  onCancel,
}) {
  const isEditMode = mode === 'edit'

  return (
    <SectionCard className="space-y-5">
      <div className="space-y-2">
        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
          {isEditMode ? 'Edit debt' : 'Debt baru'}
        </span>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
          {isEditMode ? 'Perbarui metadata debt.' : 'Tambah debt baru.'}
        </h2>
        <p className="text-sm leading-6 text-slate-600">
          Debt menyimpan nama, nilai pokok, sisa hutang, tenor opsional, dan catatan sederhana.
        </p>
      </div>

      <form className="space-y-4" onSubmit={onSubmit}>
        <FormField
          id="name"
          label="Nama debt"
          value={form.name}
          onChange={onChange}
          placeholder="Contoh: Hutang ke teman"
          error={errors.name}
        />

        {!isEditMode ? (
          <FormField
            id="principalAmount"
            label="Nominal pokok"
            type="text"
            inputMode="numeric"
            value={form.principalAmount}
            onChange={onChange}
            placeholder="Contoh: 1500000"
            error={errors.principalAmount}
            hint="Hanya angka. Nilai ini hanya diisi saat create debt."
          />
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            id="tenorValue"
            label="Tenor value"
            type="number"
            value={form.tenorValue}
            onChange={onChange}
            placeholder="Contoh: 12"
            error={errors.tenorValue}
          />
          <FormField
            id="tenorUnit"
            label="Tenor unit"
            value={form.tenorUnit}
            onChange={onChange}
            options={tenorUnitOptions}
            error={errors.tenorUnit}
          />
        </div>

        <FormField
          id="paymentAmount"
          label="Nominal cicilan"
          type="text"
          inputMode="numeric"
          value={form.paymentAmount}
          onChange={onChange}
          placeholder="Contoh: 250000"
          hint="Hanya angka."
          error={errors.paymentAmount}
        />

        <FormField
          id="note"
          label="Catatan"
          value={form.note}
          onChange={onChange}
          placeholder="Catatan tambahan"
          error={errors.note}
        />

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:bg-slate-400 sm:w-auto"
          >
            {isSubmitting
              ? isEditMode
                ? 'Menyimpan...'
                : 'Membuat...'
              : isEditMode
                ? 'Simpan perubahan'
                : 'Buat debt'}
          </button>

          {isEditMode ? (
            <button
              type="button"
              onClick={onCancel}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 sm:w-auto"
            >
              Reset form
            </button>
          ) : null}
        </div>
      </form>
    </SectionCard>
  )
}

export default DebtForm
