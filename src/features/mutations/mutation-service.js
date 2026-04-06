import { api } from "../../services/api.js";
import { createServiceError } from "../../utils/service-error.js";
import { toIsoDateTime } from "./mutation-utils.js";

function toOptionalString(value) {
  const trimmed = String(value || "").trim();
  return trimmed ? trimmed : null;
}

function toOptionalNumber(value) {
  const trimmed = String(value || "").trim();

  if (!trimmed) {
    return null;
  }

  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeTenorUnit(value) {
  const trimmed = String(value || "")
    .trim()
    .toLowerCase();

  if (!trimmed) {
    return null;
  }

  const dictionary = {
    day: "day",
    hari: "day",
    week: "week",
    minggu: "week",
    month: "month",
    bulan: "month",
    year: "year",
    tahun: "year",
  };

  return dictionary[trimmed] || trimmed;
}

function buildNewDebtPayload(form) {
  return {
    name: form.newDebtName.trim(),
    principal_amount: String(form.newDebtPrincipalAmount).trim(),
    tenor_value: toOptionalNumber(form.newDebtTenorValue),
    tenor_unit: normalizeTenorUnit(form.newDebtTenorUnit),
    payment_amount: toOptionalString(form.newDebtPaymentAmount),
    note: toOptionalString(form.newDebtNote),
  };
}

function buildMutationPayload(form) {
  const payload = {
    wallet_id: form.walletId,
    category_id: toOptionalString(form.categoryId),
    debt_id: null,
    type: form.type,
    amount: String(form.amount).trim(),
    description: form.description.trim(),
    related_to_debt: Boolean(form.relatedToDebt),
    new_debt: null,
    happened_at: toIsoDateTime(form.happenedAt),
  };

  if (!payload.related_to_debt) {
    return payload;
  }

  if (form.type === "keluar") {
    payload.debt_id = form.debtId || null;
    return payload;
  }

  if (form.debtMode === "new") {
    payload.new_debt = buildNewDebtPayload(form);
    return payload;
  }

  payload.debt_id = form.debtId || null;
  return payload;
}

export async function listMutations(filters) {
  const query = new URLSearchParams();

  if (filters.page) {
    query.set("page", String(filters.page));
  }

  if (filters.pageSize) {
    query.set("page_size", String(filters.pageSize));
  }

  if (filters.type) {
    query.set("type", filters.type);
  }

  if (filters.walletId) {
    query.set("wallet_id", filters.walletId);
  }

  if (filters.categoryId) {
    query.set("category_id", filters.categoryId);
  }

  if (filters.debtId) {
    query.set("debt_id", filters.debtId);
  }

  if (
    filters.relatedToDebt === true ||
    filters.relatedToDebt === false ||
    filters.relatedToDebt === "true" ||
    filters.relatedToDebt === "false"
  ) {
    query.set("related_to_debt", String(filters.relatedToDebt));
  }

  if (filters.from) {
    query.set("from", toIsoDateTime(filters.from));
  }

  if (filters.to) {
    query.set("to", toIsoDateTime(filters.to));
  }

  if (filters.sortBy) {
    query.set("sort_by", filters.sortBy);
  }

  if (filters.sortDirection) {
    query.set("sort_direction", filters.sortDirection);
  }

  const payload = await api.get(`/mutations?${query.toString()}`);

  return {
    items: payload?.data || [],
    meta: payload?.meta || null,
  };
}

export async function getMutationById(mutationId) {
  const payload = await api.get(`/mutations/${mutationId}`);
  return payload?.data || null;
}

export async function createMutation(form) {
  try {
    const payload = await api.post("/mutations", buildMutationPayload(form));
    return payload?.data || null;
  } catch (error) {
    throw createServiceError(error, "Gagal membuat mutasi.");
  }
}

export async function updateMutation(mutationId, form) {
  try {
    const payload = await api.put(
      `/mutations/${mutationId}`,
      buildMutationPayload(form),
    );
    return payload?.data || null;
  } catch (error) {
    throw createServiceError(error, "Gagal memperbarui mutasi.");
  }
}
