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
          title="Memeriksa sesi"
          message="Tunggu sebentar, akses ke aplikasi sedang diverifikasi."
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
          message: 'Sesi kamu sudah berakhir. Silakan masuk lagi.',
        }}
      />
    )
  }

  return children
}

export default ProtectedRoute
