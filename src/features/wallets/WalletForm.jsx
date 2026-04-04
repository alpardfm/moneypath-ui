import FormField from '../../components/forms/FormField.jsx'
import SectionCard from '../../components/layout/SectionCard.jsx'

function WalletForm({
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
          {isEditMode ? 'Edit wallet' : 'Wallet baru'}
        </span>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
          {isEditMode ? 'Perbarui nama wallet.' : 'Tambah wallet baru.'}
        </h2>
        <p className="text-sm leading-6 text-slate-600">
          Wallet hanya menyimpan metadata nama. Saldo tetap mengikuti mutasi, bukan diedit langsung
          dari UI.
        </p>
      </div>

      <form className="space-y-4" onSubmit={onSubmit}>
        <FormField
          id="name"
          label="Nama wallet"
          value={form.name}
          onChange={onChange}
          placeholder="Contoh: BCA, Cash, Jago"
          error={errors.name}
          hint="Gunakan nama yang jelas supaya mudah dipilih saat membuat mutasi."
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
                : 'Buat wallet'}
          </button>

          {isEditMode ? (
            <button
              type="button"
              onClick={onCancel}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 sm:w-auto"
            >
              Batal edit
            </button>
          ) : null}
        </div>
      </form>
    </SectionCard>
  )
}

export default WalletForm
