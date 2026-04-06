import { api } from '../../services/api.js'
import { createServiceError } from '../../utils/service-error.js'

export async function listWallets(params = {}) {
  const query = new URLSearchParams()

  if (params.page) {
    query.set('page', String(params.page))
  }

  if (params.pageSize) {
    query.set('page_size', String(params.pageSize))
  }

  const suffix = query.toString() ? `?${query.toString()}` : ''
  const payload = await api.get(`/wallets${suffix}`)

  return {
    items: payload?.data || [],
    meta: payload?.meta || null,
  }
}

export async function listArchivedWallets(params = {}) {
  const query = new URLSearchParams()

  if (params.page) {
    query.set('page', String(params.page))
  }

  if (params.pageSize) {
    query.set('page_size', String(params.pageSize))
  }

  const suffix = query.toString() ? `?${query.toString()}` : ''
  const payload = await api.get(`/wallets/archive${suffix}`)

  return {
    items: payload?.data || [],
    meta: payload?.meta || null,
  }
}

export async function createWallet(input) {
  try {
    const payload = await api.post('/wallets', { name: input.name })
    return payload?.data || null
  } catch (error) {
    throw createServiceError(error, 'Gagal membuat wallet.')
  }
}

export async function getWalletById(walletID) {
  const payload = await api.get(`/wallets/${walletID}`)
  return payload?.data || null
}

export async function updateWallet(walletID, input) {
  try {
    const payload = await api.put(`/wallets/${walletID}`, { name: input.name })
    return payload?.data || null
  } catch (error) {
    throw createServiceError(error, 'Gagal memperbarui wallet.')
  }
}

export async function inactivateWallet(walletID) {
  try {
    const payload = await api.delete(`/wallets/${walletID}`)
    return payload?.data || null
  } catch (error) {
    throw createServiceError(error, 'Gagal menonaktifkan wallet.')
  }
}
