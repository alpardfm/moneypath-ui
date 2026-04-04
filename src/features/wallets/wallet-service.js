import { api } from '../../services/api.js'

function getMessage(payload, fallbackMessage) {
  if (!payload) {
    return fallbackMessage
  }

  if (typeof payload === 'string') {
    return payload
  }

  if (typeof payload.message === 'string') {
    return payload.message
  }

  if (typeof payload.error === 'string') {
    return payload.error
  }

  return fallbackMessage
}

function createWalletError(error, fallbackMessage) {
  const walletError = new Error(getMessage(error?.payload, fallbackMessage))
  walletError.status = error?.status
  walletError.payload = error?.payload
  return walletError
}

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

export async function createWallet(input) {
  try {
    const payload = await api.post('/wallets', { name: input.name })
    return payload?.data || null
  } catch (error) {
    throw createWalletError(error, 'Gagal membuat wallet.')
  }
}

export async function updateWallet(walletID, input) {
  try {
    const payload = await api.put(`/wallets/${walletID}`, { name: input.name })
    return payload?.data || null
  } catch (error) {
    throw createWalletError(error, 'Gagal memperbarui wallet.')
  }
}

export async function inactivateWallet(walletID) {
  try {
    const payload = await api.delete(`/wallets/${walletID}`)
    return payload?.data || null
  } catch (error) {
    throw createWalletError(error, 'Gagal menonaktifkan wallet.')
  }
}
