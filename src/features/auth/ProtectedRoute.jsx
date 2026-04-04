import { Navigate, useLocation } from 'react-router-dom'
import LoadingState from '../../components/feedback/LoadingState.jsx'
import { useAuth } from '../../app/providers/useAuth.jsx'

function ProtectedRoute({ children }) {
  const { authReady, isAuthenticated } = useAuth()
  const location = useLocation()

  if (!authReady) {
    return (
      <div className="p-4 sm:p-6">
        <LoadingState
          title="Checking your session"
          message="Please wait while we verify access to the app."
        />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: `${location.pathname}${location.search}`,
          message: 'Your session has ended. Please login again.',
        }}
      />
    )
  }

  return children
}

export default ProtectedRoute
