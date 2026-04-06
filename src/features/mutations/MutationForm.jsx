import FormField from "../../components/forms/FormField.jsx";
import SectionCard from "../../components/layout/SectionCard.jsx";
import { tenorUnitOptions } from "../debts/debt-constants.js";
import { debtModeOptions, mutationTypeOptions } from "./mutation-utils.js";

function MutationForm({
  mode = "create",
  form,
  errors,
  isSubmitting,
  walletOptions,
  categoryOptions,
  debtOptions,
  onChange,
  onSubmit,
  onCancel,
}) {
  const isEditMode = mode === "edit";
  const showExistingDebtSelect =
    form.relatedToDebt &&
    (form.type === "keluar" ||
      (form.type === "masuk" && form.debtMode === "existing"));
  const showDebtMode = form.relatedToDebt && form.type === "masuk";
  const showNewDebtFields =
    form.relatedToDebt && form.type === "masuk" && form.debtMode === "new";

  return (
    <SectionCard className="space-y-5">
      <div className="space-y-2">
        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
          {isEditMode ? "Ubah mutasi" : "Mutasi baru"}
        </span>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
          {isEditMode ? "Perbarui mutasi." : "Catat mutasi baru."}
        </h2>
        <p className="text-sm leading-6 text-slate-600">
          Semua perubahan saldo harus lewat mutasi. UI ini tidak menyediakan
          hapus mutasi.
        </p>
      </div>

      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            id="walletId"
            label="Wallet"
            value={form.walletId}
            onChange={onChange}
            options={walletOptions}
            error={errors.walletId}
          />
          <FormField
            id="type"
            label="Tipe mutasi"
            value={form.type}
            onChange={onChange}
            options={mutationTypeOptions.filter((item) => item.value)}
            error={errors.type}
          />
        </div>

        <FormField
          id="categoryId"
          label="Kategori"
          value={form.categoryId}
          onChange={onChange}
          options={categoryOptions}
          hint="Opsional, tapi disarankan agar mutasi lebih rapi."
          error={errors.categoryId}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            id="amount"
            label="Nominal"
            type="text"
            inputMode="numeric"
            value={form.amount}
            onChange={onChange}
            placeholder="Contoh: 150000"
            hint="Hanya angka."
            error={errors.amount}
          />
          <FormField
            id="happenedAt"
            label="Tanggal kejadian"
            type="datetime-local"
            value={form.happenedAt}
            onChange={onChange}
            error={errors.happenedAt}
          />
        </div>

        <FormField
          id="description"
          label="Deskripsi"
          value={form.description}
          onChange={onChange}
          placeholder="Contoh: Gaji, bayar cicilan, pinjam uang"
          error={errors.description}
        />

        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <div className="flex items-start gap-3">
            <input
              id="relatedToDebt"
              type="checkbox"
              name="relatedToDebt"
              checked={form.relatedToDebt}
              onChange={onChange}
              aria-label="Terkait debt"
              className="mt-1 h-4 w-4 rounded border-slate-300"
            />
            <span>
              <span className="block text-sm font-medium text-slate-700">
                Terkait debt
              </span>
              <span className="mt-1 block text-sm leading-6 text-slate-500">
                Aktifkan jika mutasi ini berhubungan dengan hutang yang sudah
                ada atau membuat hutang baru dari arus masuk.
              </span>
            </span>
          </div>
        </div>

        {showDebtMode ? (
          <FormField
            id="debtMode"
            label="Mode debt"
            value={form.debtMode}
            onChange={onChange}
            options={debtModeOptions}
            error={errors.debtMode}
          />
        ) : null}

        {showExistingDebtSelect ? (
          <FormField
            id="debtId"
            label="Debt"
            value={form.debtId}
            onChange={onChange}
            options={debtOptions}
            error={errors.debtId}
          />
        ) : null}

        {showNewDebtFields ? (
          <SectionCard tone="subtle" className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-900">
                Debt baru dari mutasi masuk
              </p>
              <p className="text-sm leading-6 text-slate-500">
                Backend hanya mengizinkan satu pilihan: pilih debt yang sudah
                ada atau buat debt baru.
              </p>
            </div>

            <FormField
              id="newDebtName"
              label="Nama debt baru"
              value={form.newDebtName}
              onChange={onChange}
              placeholder="Contoh: Pinjam teman"
              error={errors.newDebtName}
            />
            <FormField
              id="newDebtPrincipalAmount"
              label="Nominal pokok debt"
              type="text"
              inputMode="numeric"
              value={form.newDebtPrincipalAmount}
              onChange={onChange}
              placeholder="Contoh: 500000"
              hint="Hanya angka."
              error={errors.newDebtPrincipalAmount}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                id="newDebtTenorValue"
                label="Nilai tenor"
                type="number"
                value={form.newDebtTenorValue}
                onChange={onChange}
                error={errors.newDebtTenorValue}
              />
              <FormField
                id="newDebtTenorUnit"
                label="Satuan tenor"
                value={form.newDebtTenorUnit}
                onChange={onChange}
                options={tenorUnitOptions}
                error={errors.newDebtTenorUnit}
              />
            </div>
            <FormField
              id="newDebtPaymentAmount"
              label="Nominal cicilan"
              type="text"
              inputMode="numeric"
              value={form.newDebtPaymentAmount}
              onChange={onChange}
              hint="Hanya angka."
              error={errors.newDebtPaymentAmount}
            />
            <FormField
              id="newDebtNote"
              label="Catatan debt"
              value={form.newDebtNote}
              onChange={onChange}
              error={errors.newDebtNote}
            />
          </SectionCard>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:bg-slate-400 sm:w-auto"
          >
            {isSubmitting
              ? isEditMode
                ? "Menyimpan..."
                : "Membuat..."
              : isEditMode
                ? "Simpan perubahan"
                : "Buat mutasi"}
          </button>

          {isEditMode ? (
            <button
              type="button"
              onClick={onCancel}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 sm:w-auto"
            >
              Atur ulang form
            </button>
          ) : null}
        </div>
      </form>
    </SectionCard>
  );
}

export default MutationForm;
