import { api } from '../../services/api.js'
import { createServiceError } from '../../utils/service-error.js'

function toOptionalString(value) {
  const trimmed = String(value || '').trim()
  return trimmed ? trimmed : null
}

function normalizeTenorUnit(value) {
  const trimmed = String(value || '').trim().toLowerCase()

  if (!trimmed) {
    return null
  }

  const dictionary = {
    day: 'day',
    hari: 'day',
    week: 'week',
    minggu: 'week',
    month: 'month',
    bulan: 'month',
    year: 'year',
    tahun: 'year',
  }

  return dictionary[trimmed] || trimmed
}

function toOptionalNumber(value) {
  const trimmed = String(value || '').trim()

  if (!trimmed) {
    return null
  }

  const parsed = Number(trimmed)
  return Number.isFinite(parsed) ? parsed : null
}

function buildCreatePayload(form) {
  return {
    name: form.name.trim(),
    principal_amount: String(form.principalAmount).trim(),
    tenor_value: toOptionalNumber(form.tenorValue),
    tenor_unit: normalizeTenorUnit(form.tenorUnit),
    payment_amount: toOptionalString(form.paymentAmount),
    note: toOptionalString(form.note),
  }
}

function buildUpdatePayload(form) {
  return {
    name: form.name.trim(),
    tenor_value: toOptionalNumber(form.tenorValue),
    tenor_unit: normalizeTenorUnit(form.tenorUnit),
    payment_amount: toOptionalString(form.paymentAmount),
    note: toOptionalString(form.note),
  }
}

export async function listDebts(params = {}) {
  const query = new URLSearchParams()

  if (params.page) {
    query.set('page', String(params.page))
  }

  if (params.pageSize) {
    query.set('page_size', String(params.pageSize))
  }

  const suffix = query.toString() ? `?${query.toString()}` : ''
  const payload = await api.get(`/debts${suffix}`)

  return {
    items: payload?.data || [],
    meta: payload?.meta || null,
  }
}

export async function getDebtById(debtID) {
  const payload = await api.get(`/debts/${debtID}`)
  return payload?.data || null
}

export async function createDebt(form) {
  try {
    const payload = await api.post('/debts', buildCreatePayload(form))
    return payload?.data || null
  } catch (error) {
    throw createServiceError(error, 'Gagal membuat debt.')
  }
}

export async function updateDebt(debtID, form) {
  try {
    const payload = await api.put(`/debts/${debtID}`, buildUpdatePayload(form))
    return payload?.data || null
  } catch (error) {
    throw createServiceError(error, 'Gagal memperbarui debt.')
  }
}

export async function inactivateDebt(debtID) {
  try {
    const payload = await api.delete(`/debts/${debtID}`)
    return payload?.data || null
  } catch (error) {
    throw createServiceError(error, 'Gagal menonaktifkan debt.')
  }
}
