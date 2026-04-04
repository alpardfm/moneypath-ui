import { Navigate } from 'react-router-dom'
import { useAuth } from '../../app/providers/useAuth.jsx'

function PublicOnlyRoute({ children }) {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/app/dashboard" replace />
  }

  return children
}

export default PublicOnlyRoute
