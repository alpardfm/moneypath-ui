import { useCallback, useEffect, useMemo, useState } from "react";
import EmptyState from "../components/feedback/EmptyState.jsx";
import ErrorState from "../components/feedback/ErrorState.jsx";
import LoadingState from "../components/feedback/LoadingState.jsx";
import SuccessBanner from "../components/feedback/SuccessBanner.jsx";
import FormField from "../components/forms/FormField.jsx";
import PageContainer from "../components/layout/PageContainer.jsx";
import PageHeader from "../components/layout/PageHeader.jsx";
import SectionCard from "../components/layout/SectionCard.jsx";
import { listCategories } from "../features/categories/category-service.js";
import { getCategoryTypeLabel } from "../features/categories/category-utils.js";
import { listWallets } from "../features/wallets/wallet-service.js";
import RecurringForm from "../features/recurring/RecurringForm.jsx";
import {
  createRecurringRule,
  inactivateRecurringRule,
  listRecurringRules,
  runDueRecurringRules,
  updateRecurringRule,
} from "../features/recurring/recurring-service.js";
import {
  createRecurringFormFromItem,
  formatRecurringDateTime,
  getRecurringIntervalLabel,
  getRecurringTypeLabel,
  getRecurringTypeTone,
  recurringFilterTypeOptions,
} from "../features/recurring/recurring-utils.js";
import { formatAmount } from "../utils/format-number.js";
import { sanitizeDigits } from "../utils/sanitize-input.js";

function RecurringPage() {
  const [rules, setRules] = useState([]);
  const [meta, setMeta] = useState(null);
  const [wallets, setWallets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterType, setFilterType] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [form, setForm] = useState(() => createRecurringFormFromItem());
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRunningDue, setIsRunningDue] = useState(false);
  const [actingRuleId, setActingRuleId] = useState("");
  const [editingRuleId, setEditingRuleId] = useState("");

  const walletOptions = useMemo(
    () => [
      { value: "", label: "Pilih wallet" },
      ...wallets.map((wallet) => ({
        value: wallet.id,
        label: `${wallet.name} (${formatAmount(wallet.balance)})`,
      })),
    ],
    [wallets],
  );

  const categoryOptions = useMemo(() => {
    const placeholder =
      form.type === "masuk" ? "Pilih kategori masuk" : "Pilih kategori keluar";

    return [
      { value: "", label: placeholder },
      ...categories
        .filter((category) => category.type === form.type)
        .map((category) => ({
          value: category.id,
          label: category.name,
        })),
    ];
  }, [categories, form.type]);

  const walletNameById = useMemo(
    () => Object.fromEntries(wallets.map((wallet) => [wallet.id, wallet.name])),
    [wallets],
  );

  const categoryLabelById = useMemo(
    () =>
      Object.fromEntries(
        categories.map((category) => [
          category.id,
          `${category.name} (${getCategoryTypeLabel(category.type)})`,
        ]),
      ),
    [categories],
  );

  const resetForm = useCallback(() => {
    setForm(createRecurringFormFromItem());
    setErrors({});
    setFormError("");
    setEditingRuleId("");
  }, []);

  const loadDependencies = useCallback(async () => {
    try {
      const [walletResult, categoryResult] = await Promise.all([
        listWallets({ page: 1, pageSize: 100 }),
        listCategories({ page: 1, pageSize: 100 }),
      ]);

      setWallets(walletResult.items);
      setCategories(categoryResult.items);
    } catch (error) {
      setErrorMessage(error.message || "Gagal memuat referensi recurring.");
    }
  }, []);

  const loadRules = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const result = await listRecurringRules({
        page: 1,
        pageSize: 50,
        type: filterType,
      });
      setRules(result.items);
      setMeta(result.meta);
    } catch (error) {
      setErrorMessage(error.message || "Gagal memuat recurring.");
    } finally {
      setIsLoading(false);
    }
  }, [filterType]);

  useEffect(() => {
    loadDependencies();
  }, [loadDependencies]);

  useEffect(() => {
    loadRules();
  }, [loadRules]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    const numberOnlyFields = ["amount", "intervalStep"];
    const nextValue = numberOnlyFields.includes(name)
      ? sanitizeDigits(value)
      : value;

    setForm((currentForm) => {
      const nextForm = {
        ...currentForm,
        [name]: nextValue,
      };

      if (name === "type" && currentForm.categoryId) {
        const currentCategory = categories.find(
          (category) => category.id === currentForm.categoryId,
        );
        if (currentCategory && currentCategory.type !== value) {
          nextForm.categoryId = "";
        }
      }

      return nextForm;
    });

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!form.walletId.trim()) {
      nextErrors.walletId = "Wallet wajib dipilih.";
    }

    if (!form.type.trim()) {
      nextErrors.type = "Tipe recurring wajib dipilih.";
    }

    if (!String(form.amount).trim()) {
      nextErrors.amount = "Nominal wajib diisi.";
    }

    if (!form.description.trim()) {
      nextErrors.description = "Deskripsi wajib diisi.";
    }

    if (!form.intervalUnit.trim()) {
      nextErrors.intervalUnit = "Interval wajib dipilih.";
    }

    if (!String(form.intervalStep).trim() || Number(form.intervalStep) <= 0) {
      nextErrors.intervalStep = "Jarak interval minimal 1.";
    }

    if (!form.startAt) {
      nextErrors.startAt = "Waktu mulai wajib diisi.";
    }

    if (
      form.endAt &&
      new Date(form.endAt).getTime() < new Date(form.startAt).getTime()
    ) {
      nextErrors.endAt =
        "Waktu selesai tidak boleh lebih awal dari waktu mulai.";
    }

    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validateForm();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError("");
      setFormSuccess("");

      if (editingRuleId) {
        await updateRecurringRule(editingRuleId, form);
        setFormSuccess("Recurring berhasil diperbarui.");
      } else {
        await createRecurringRule(form);
        setFormSuccess("Recurring baru berhasil dibuat.");
      }

      resetForm();
      await loadRules();
    } catch (error) {
      setFormError(error.message || "Aksi recurring gagal.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (rule) => {
    setEditingRuleId(rule.id);
    setForm(createRecurringFormFromItem(rule));
    setErrors({});
    setFormError("");
    setFormSuccess("");
  };

  const handleInactivate = async (rule) => {
    try {
      setActingRuleId(rule.id);
      setFormError("");
      setFormSuccess("");

      await inactivateRecurringRule(rule.id);

      if (editingRuleId === rule.id) {
        resetForm();
      }

      setFormSuccess(`Recurring ${rule.description} berhasil dinonaktifkan.`);
      await loadRules();
    } catch (error) {
      setFormError(error.message || "Gagal menonaktifkan recurring.");
    } finally {
      setActingRuleId("");
    }
  };

  const handleRunDue = async () => {
    try {
      setIsRunningDue(true);
      setFormError("");
      setFormSuccess("");

      const result = await runDueRecurringRules();
      const skippedCount = Array.isArray(result?.skipped)
        ? result.skipped.length
        : 0;

      setFormSuccess(
        `Recurring due diproses: ${result?.processed || 0}. Dilewati: ${skippedCount}.`,
      );
      await loadRules();
    } catch (error) {
      setFormError(error.message || "Gagal menjalankan recurring due.");
    } finally {
      setIsRunningDue(false);
    }
  };

  return (
    <PageContainer className="space-y-6">
      <PageHeader eyebrow="Recurring" title="Jadwal mutasi berulang." />

      {formError ? (
        <ErrorState title="Aksi recurring gagal" message={formError} />
      ) : null}
      <SuccessBanner message={formSuccess} />

      <SectionCard className="space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-500">
              Sinkronisasi recurring
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
              {meta?.total_items || rules.length} recurring aktif
            </h2>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <FormField
              id="filterType"
              label="Filter tipe"
              value={filterType}
              onChange={(event) => setFilterType(event.target.value)}
              options={recurringFilterTypeOptions}
              className="min-w-[220px]"
            />
            <button
              type="button"
              onClick={handleRunDue}
              disabled={isRunningDue}
              className="mt-auto rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
            >
              {isRunningDue ? "Menjalankan..." : "Run due sekarang"}
            </button>
          </div>
        </div>
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="space-y-4">
          {isLoading ? (
            <LoadingState
              title="Memuat recurring"
              message="Daftar jadwal mutasi berulang sedang diambil dari server."
            />
          ) : errorMessage ? (
            <ErrorState
              title="Recurring belum bisa dimuat"
              message={errorMessage}
              actionLabel="Coba lagi"
              onAction={loadRules}
            />
          ) : rules.length === 0 ? (
            <EmptyState
              title="Belum ada recurring aktif"
              message="Buat jadwal rutin seperti gaji atau biaya bulanan agar mutasi due bisa dibuat lebih cepat."
            />
          ) : (
            <div className="space-y-4">
              {rules.map((rule) => (
                <SectionCard key={rule.id} className="space-y-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getRecurringTypeTone(rule.type)}`}
                        >
                          {getRecurringTypeLabel(rule.type)}
                        </span>
                        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                          {getRecurringIntervalLabel(rule)}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">
                          {rule.description}
                        </h3>
                        <p className="mt-2 text-sm text-slate-500">
                          Nominal: {formatAmount(rule.amount)}
                        </p>
                      </div>

                      <div className="grid gap-3 text-sm text-slate-500 sm:grid-cols-2">
                        <p>
                          Wallet:{" "}
                          {walletNameById[rule.wallet_id] || rule.wallet_id}
                        </p>
                        <p>
                          Kategori:{" "}
                          {rule.category_id
                            ? categoryLabelById[rule.category_id] ||
                              "Kategori lama / nonaktif"
                            : "Tanpa kategori"}
                        </p>
                        <p>Mulai: {formatRecurringDateTime(rule.start_at)}</p>
                        <p>
                          Berikutnya:{" "}
                          {formatRecurringDateTime(rule.next_run_at)}
                        </p>
                        <p>
                          Terakhir jalan:{" "}
                          {rule.last_run_at
                            ? formatRecurringDateTime(rule.last_run_at)
                            : "Belum pernah"}
                        </p>
                        <p>
                          Berakhir:{" "}
                          {rule.end_at
                            ? formatRecurringDateTime(rule.end_at)
                            : "Tidak dibatasi"}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 sm:w-auto sm:items-end">
                      <button
                        type="button"
                        onClick={() => handleEdit(rule)}
                        className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                      >
                        Ubah recurring
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInactivate(rule)}
                        disabled={actingRuleId === rule.id}
                        className="rounded-xl border border-rose-200 px-4 py-2.5 text-sm font-medium text-rose-700 transition hover:bg-rose-50 disabled:opacity-60"
                      >
                        {actingRuleId === rule.id
                          ? "Menonaktifkan..."
                          : "Nonaktifkan"}
                      </button>
                    </div>
                  </div>
                </SectionCard>
              ))}
            </div>
          )}
        </section>

        <RecurringForm
          mode={editingRuleId ? "edit" : "create"}
          form={form}
          errors={errors}
          isSubmitting={isSubmitting}
          walletOptions={walletOptions}
          categoryOptions={categoryOptions}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={resetForm}
        />
      </div>
    </PageContainer>
  );
}

export default RecurringPage;
