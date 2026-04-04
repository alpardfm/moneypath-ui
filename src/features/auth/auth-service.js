import { api } from '../../services/api.js'
import { extractApiMessage } from '../../utils/api-message.js'

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

function createAuthError(error, fallbackMessage) {
  const authError = new Error(extractMessage(error?.payload, fallbackMessage))
  authError.status = error?.status
  authError.payload = error?.payload
  return authError
}

export async function loginUser(formData) {
  try {
    const payload = await api.post('/auth/login', {
      email_or_username: formData.emailOrUsername,
      password: formData.password,
    })

    const token = extractToken(payload)

    if (!token) {
      throw createAuthError({ payload }, 'Login succeeded but no auth token was returned.')
    }

    return {
      payload,
      token,
    }
  } catch (error) {
    throw createAuthError(error, 'Unable to login with the provided credentials.')
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
      message: extractMessage(payload, 'Account created successfully.'),
    }
  } catch (error) {
    throw createAuthError(error, 'Unable to create your account right now.')
  }
}
