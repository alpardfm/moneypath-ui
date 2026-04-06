export const recurringTypeOptions = [
  { value: "masuk", label: "Masuk" },
  { value: "keluar", label: "Keluar" },
];

export const recurringFilterTypeOptions = [
  { value: "", label: "Semua tipe" },
  ...recurringTypeOptions,
];

export const recurringIntervalOptions = [
  { value: "daily", label: "Harian" },
  { value: "weekly", label: "Mingguan" },
  { value: "monthly", label: "Bulanan" },
];

function formatRecurringUnit(step, unit) {
  const total = Number(step) || 1;

  switch (unit) {
    case "daily":
      return total === 1 ? "setiap hari" : `setiap ${total} hari`;
    case "weekly":
      return total === 1 ? "setiap minggu" : `setiap ${total} minggu`;
    default:
      return total === 1 ? "setiap bulan" : `setiap ${total} bulan`;
  }
}

export function getRecurringTypeLabel(type) {
  return type === "masuk" ? "Masuk" : "Keluar";
}

export function getRecurringTypeTone(type) {
  return type === "masuk"
    ? "bg-emerald-100 text-emerald-700"
    : "bg-rose-100 text-rose-700";
}

export function getRecurringIntervalLabel(rule) {
  return formatRecurringUnit(rule?.interval_step, rule?.interval_unit);
}

export function toDateTimeLocal(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const timezoneOffset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - timezoneOffset * 60 * 1000);
  return localDate.toISOString().slice(0, 16);
}

export function toIsoDateTime(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

export function createCurrentDateTimeLocal() {
  return toDateTimeLocal(new Date().toISOString());
}

export function formatRecurringDateTime(value) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function createRecurringFormFromItem(item) {
  return {
    walletId: item?.wallet_id || "",
    categoryId: item?.category_id || "",
    type: item?.type || "keluar",
    amount: item?.amount || "",
    description: item?.description || "",
    intervalUnit: item?.interval_unit || "monthly",
    intervalStep: String(item?.interval_step || 1),
    startAt: item?.start_at
      ? toDateTimeLocal(item.start_at)
      : createCurrentDateTimeLocal(),
    endAt: item?.end_at ? toDateTimeLocal(item.end_at) : "",
  };
}
