import { api } from "../../services/api.js";
import { createServiceError } from "../../utils/service-error.js";
import { toIsoDateTime } from "./recurring-utils.js";

function toOptionalString(value) {
  const trimmed = String(value || "").trim();
  return trimmed ? trimmed : null;
}

function toRequiredNumber(value) {
  const parsed = Number(String(value || "").trim());
  return Number.isFinite(parsed) ? parsed : 0;
}

function buildRecurringPayload(form) {
  return {
    wallet_id: form.walletId,
    category_id: toOptionalString(form.categoryId),
    type: form.type,
    amount: String(form.amount).trim(),
    description: String(form.description || "").trim(),
    interval_unit: form.intervalUnit,
    interval_step: toRequiredNumber(form.intervalStep),
    start_at: toIsoDateTime(form.startAt),
    end_at: form.endAt ? toIsoDateTime(form.endAt) : null,
  };
}

export async function listRecurringRules(params = {}) {
  const query = new URLSearchParams();

  if (params.page) {
    query.set("page", String(params.page));
  }

  if (params.pageSize) {
    query.set("page_size", String(params.pageSize));
  }

  if (params.type) {
    query.set("type", params.type);
  }

  const suffix = query.toString() ? `?${query.toString()}` : "";
  const payload = await api.get(`/recurring-rules${suffix}`);

  return {
    items: payload?.data || [],
    meta: payload?.meta || null,
  };
}

export async function createRecurringRule(form) {
  try {
    const payload = await api.post(
      "/recurring-rules",
      buildRecurringPayload(form),
    );
    return payload?.data || null;
  } catch (error) {
    throw createServiceError(error, "Gagal membuat jadwal berulang.");
  }
}

export async function updateRecurringRule(ruleId, form) {
  try {
    const payload = await api.put(
      `/recurring-rules/${ruleId}`,
      buildRecurringPayload(form),
    );
    return payload?.data || null;
  } catch (error) {
    throw createServiceError(error, "Gagal memperbarui jadwal berulang.");
  }
}

export async function inactivateRecurringRule(ruleId) {
  try {
    const payload = await api.delete(`/recurring-rules/${ruleId}`);
    return payload?.data || null;
  } catch (error) {
    throw createServiceError(error, "Gagal menonaktifkan jadwal berulang.");
  }
}

export async function runDueRecurringRules() {
  try {
    const payload = await api.post("/recurring-rules/run-due", {});
    return payload?.data || { processed: 0, skipped: [] };
  } catch (error) {
    throw createServiceError(
      error,
      "Gagal menjalankan recurring yang jatuh tempo.",
    );
  }
}
