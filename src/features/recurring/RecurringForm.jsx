import FormField from "../../components/forms/FormField.jsx";
import SectionCard from "../../components/layout/SectionCard.jsx";
import {
  recurringIntervalOptions,
  recurringTypeOptions,
} from "./recurring-utils.js";

function RecurringForm({
  mode = "create",
  form,
  errors,
  isSubmitting,
  walletOptions,
  categoryOptions,
  onChange,
  onSubmit,
  onCancel,
}) {
  const isEditMode = mode === "edit";

  return (
    <SectionCard className="space-y-5">
      <div className="space-y-2">
        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
          {isEditMode ? "Ubah recurring" : "Recurring baru"}
        </span>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
          {isEditMode
            ? "Perbarui jadwal mutasi berulang."
            : "Buat jadwal mutasi berulang."}
        </h2>
        <p className="text-sm leading-6 text-slate-600">
          Recurring akan membuat mutasi baru saat jatuh tempo. Flow debt belum
          didukung dari UI ini.
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
            label="Tipe"
            value={form.type}
            onChange={onChange}
            options={recurringTypeOptions}
            error={errors.type}
          />
        </div>

        <FormField
          id="categoryId"
          label="Kategori"
          value={form.categoryId}
          onChange={onChange}
          options={categoryOptions}
          hint="Opsional. Kategori akan difilter mengikuti tipe recurring."
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
            id="description"
            label="Deskripsi"
            value={form.description}
            onChange={onChange}
            placeholder="Contoh: Gaji bulanan, biaya kos"
            error={errors.description}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            id="intervalUnit"
            label="Interval"
            value={form.intervalUnit}
            onChange={onChange}
            options={recurringIntervalOptions}
            error={errors.intervalUnit}
          />
          <FormField
            id="intervalStep"
            label="Jarak interval"
            type="text"
            inputMode="numeric"
            value={form.intervalStep}
            onChange={onChange}
            placeholder="Contoh: 1"
            hint="Contoh 2 + mingguan berarti setiap 2 minggu."
            error={errors.intervalStep}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            id="startAt"
            label="Mulai pada"
            type="datetime-local"
            value={form.startAt}
            onChange={onChange}
            error={errors.startAt}
          />
          <FormField
            id="endAt"
            label="Berakhir pada"
            type="datetime-local"
            value={form.endAt}
            onChange={onChange}
            hint="Opsional. Kosongkan jika recurring ingin berjalan terus."
            error={errors.endAt}
          />
        </div>

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
                : "Buat recurring"}
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
  );
}

export default RecurringForm;
