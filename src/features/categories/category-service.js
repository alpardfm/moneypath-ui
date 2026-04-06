import { api, API_BASE_URL } from '../../services/api.js'
import { getAuthToken } from '../../utils/auth.js'
import { createServiceError } from '../../utils/service-error.js'

export async function listCategories(params = {}) {
  const query = new URLSearchParams()

  if (params.page) {
    query.set('page', String(params.page))
  }

  if (params.pageSize) {
    query.set('page_size', String(params.pageSize))
  }

  if (params.type) {
    query.set('type', params.type)
  }

  const suffix = query.toString() ? `?${query.toString()}` : ''
  const payload = await api.get(`/categories${suffix}`)

  return {
    items: payload?.data || [],
    meta: payload?.meta || null,
  }
}

export async function createCategory(input) {
  try {
    const payload = await api.post('/categories', {
      name: input.name.trim(),
      type: input.type,
    })
    return payload?.data || null
  } catch (error) {
    throw createServiceError(error, 'Gagal membuat kategori.')
  }
}

export async function inactivateCategory(categoryId) {
  try {
    const payload = await api.delete(`/categories/${categoryId}`)
    return payload?.data || null
  } catch (error) {
    throw createServiceError(error, 'Gagal menonaktifkan kategori.')
  }
}

export async function exportMutationsCsv(filters) {
  const query = new URLSearchParams()

  if (filters.type) {
    query.set('type', filters.type)
  }

  if (filters.walletId) {
    query.set('wallet_id', filters.walletId)
  }

  if (filters.categoryId) {
    query.set('category_id', filters.categoryId)
  }

  if (filters.debtId) {
    query.set('debt_id', filters.debtId)
  }

  if (filters.from) {
    query.set('from', String(filters.from).slice(0, 10))
  }

  if (filters.to) {
    query.set('to', String(filters.to).slice(0, 10))
  }

  const token = getAuthToken()
  const response = await fetch(`${API_BASE_URL}/exports/mutations.csv?${query.toString()}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })

  if (!response.ok) {
    throw createServiceError(
      { status: response.status, payload: await response.text() },
      'Gagal mengekspor mutasi.',
    )
  }

  const blob = await response.blob()
  const contentDisposition = response.headers.get('content-disposition') || ''
  const match = contentDisposition.match(/filename="?([^"]+)"?/)

  return {
    blob,
    filename: match?.[1] || 'mutations-export.csv',
  }
}
