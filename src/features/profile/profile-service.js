import { api } from '../../services/api.js'
import { createServiceError } from '../../utils/service-error.js'

export async function getCurrentProfile() {
  try {
    const payload = await api.get('/me')
    return payload?.data || null
  } catch (error) {
    throw createServiceError(error, 'Gagal memuat profil.')
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
    throw createServiceError(error, 'Gagal memperbarui profil.')
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
    throw createServiceError(error, 'Gagal mengganti password.')
  }
}
