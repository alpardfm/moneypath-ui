import { api } from '../../services/api.js'
import { extractApiMessage } from '../../utils/api-message.js'
import { createServiceError } from '../../utils/service-error.js'

function extractToken(payload) {
  if (!payload || typeof payload !== 'object') {
    return ''
  }

  const directToken =
    payload.token ||
    payload.access_token ||
    payload.accessToken ||
    payload.jwt ||
    ''

  if (directToken) {
    return directToken
  }

  const nestedData = payload.data && typeof payload.data === 'object' ? payload.data : null

  if (!nestedData) {
    return ''
  }

  return (
    nestedData.token ||
    nestedData.access_token ||
    nestedData.accessToken ||
    nestedData.jwt ||
    ''
  )
}

function extractMessage(payload, fallbackMessage) {
  return extractApiMessage(payload, fallbackMessage)
}

export async function loginUser(formData) {
  try {
    const payload = await api.post('/auth/login', {
      email_or_username: formData.emailOrUsername,
      password: formData.password,
    })

    const token = extractToken(payload)

    if (!token) {
      throw createServiceError(
        { payload },
        'Login berhasil, tetapi token tidak ditemukan.',
      )
    }

    return {
      payload,
      token,
    }
  } catch (error) {
    throw createServiceError(error, 'Tidak bisa masuk dengan kredensial yang diberikan.')
  }
}

export async function registerUser(formData) {
  try {
    const payload = await api.post('/auth/register', {
      email: formData.email,
      username: formData.username,
      password: formData.password,
      full_name: formData.fullName,
    })

    return {
      payload,
      token: extractToken(payload),
      message: extractMessage(payload, 'Akun berhasil dibuat.'),
    }
  } catch (error) {
    throw createServiceError(error, 'Akun belum bisa dibuat saat ini.')
  }
}
