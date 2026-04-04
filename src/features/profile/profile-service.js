import { api } from '../../services/api.js'
import { extractApiMessage } from '../../utils/api-message.js'

function createProfileError(error, fallbackMessage) {
  const profileError = new Error(extractApiMessage(error?.payload, fallbackMessage))
  profileError.status = error?.status
  profileError.payload = error?.payload
  return profileError
}

export async function getCurrentProfile() {
  try {
    const payload = await api.get('/me')
    return payload?.data || null
  } catch (error) {
    throw createProfileError(error, 'Gagal memuat profil.')
  }
}

export async function updateCurrentProfile(form) {
  try {
    const payload = await api.put('/me', {
      email: form.email.trim(),
      username: form.username.trim(),
      full_name: form.fullName.trim(),
    })

    return payload?.data || null
  } catch (error) {
    throw createProfileError(error, 'Gagal memperbarui profil.')
  }
}

export async function changeCurrentPassword(form) {
  try {
    const payload = await api.put('/me/password', {
      current_password: form.currentPassword,
      new_password: form.newPassword,
    })

    return payload?.data || null
  } catch (error) {
    throw createProfileError(error, 'Gagal mengganti password.')
  }
}
