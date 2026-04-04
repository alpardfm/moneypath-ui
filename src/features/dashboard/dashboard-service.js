import { api } from '../../services/api.js'

export async function getDashboardOverview() {
  const payload = await api.get('/dashboard')

  if (!payload || typeof payload !== 'object') {
    throw new Error('Dashboard response is invalid.')
  }

  return payload.data || null
}
