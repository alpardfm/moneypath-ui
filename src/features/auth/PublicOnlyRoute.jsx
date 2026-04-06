import { Navigate } from 'react-router-dom'
import LoadingState from '../../components/feedback/LoadingState.jsx'
import { useAuth } from '../../app/providers/useAuth.jsx'

function PublicOnlyRoute({ children }) {
  const { authReady, isAuthenticated } = useAuth()

  if (!authReady) {
    return (
      <div className="p-4 sm:p-6">
        <LoadingState
          title="Memeriksa sesi"
          message="Tunggu sebentar, status masuk kamu sedang diperiksa."
        />
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/app/dashboard" replace />
  }

  return children
}

export default PublicOnlyRoute
