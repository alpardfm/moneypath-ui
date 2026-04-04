const AUTH_TOKEN_KEY = 'moneypath_token'
const AUTH_CHANGE_EVENT = 'moneypath:auth-change'

function emitAuthChange() {
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT))
}

export function getAuthToken() {
  return window.localStorage.getItem(AUTH_TOKEN_KEY) || ''
}

export function setAuthToken(token) {
  window.localStorage.setItem(AUTH_TOKEN_KEY, token)
  emitAuthChange()
}

export function clearAuthToken() {
  window.localStorage.removeItem(AUTH_TOKEN_KEY)
  emitAuthChange()
}

export { AUTH_CHANGE_EVENT, AUTH_TOKEN_KEY }
