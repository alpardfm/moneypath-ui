import { extractApiMessage } from './api-message.js'

export function createServiceError(error, fallbackMessage) {
  const payload = error?.payload
  const message = extractApiMessage(payload, error?.message || fallbackMessage)
  const serviceError = new Error(message)

  serviceError.status = error?.status
  serviceError.payload = payload

  return serviceError
}
