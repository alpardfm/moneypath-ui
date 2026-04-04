import { useEffect, useMemo, useState } from 'react'
import {
  AUTH_CHANGE_EVENT,
  clearAuthToken,
  getAuthToken,
  setAuthToken,
} from '../../utils/auth.js'
import { AuthContext } from './auth-context.jsx'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getAuthToken())

  useEffect(() => {
    if (token) {
      setAuthToken(token)
      return
    }

    clearAuthToken()
  }, [token])

  useEffect(() => {
    const syncToken = () => {
      setToken(getAuthToken())
    }

    window.addEventListener('storage', syncToken)
    window.addEventListener(AUTH_CHANGE_EVENT, syncToken)

    return () => {
      window.removeEventListener('storage', syncToken)
      window.removeEventListener(AUTH_CHANGE_EVENT, syncToken)
    }
  }, [])

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(token),
      token,
      login: setToken,
      logout: () => setToken(''),
    }),
    [token],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
