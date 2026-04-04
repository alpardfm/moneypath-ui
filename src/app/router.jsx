import { Navigate, createBrowserRouter } from 'react-router-dom'
import AppShell from './layout/AppShell.jsx'
import PublicOnlyRoute from '../features/auth/PublicOnlyRoute.jsx'
import ProtectedRoute from '../features/auth/ProtectedRoute.jsx'
import DashboardPage from '../pages/DashboardPage.jsx'
import DebtDetailPage from '../pages/DebtDetailPage.jsx'
import DebtPage from '../pages/DebtPage.jsx'
import LoginPage from '../pages/LoginPage.jsx'
import NotFoundPage from '../pages/NotFoundPage.jsx'
import RegisterPage from '../pages/RegisterPage.jsx'
import WalletPage from '../pages/WalletPage.jsx'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/app/dashboard" replace />,
  },
  {
    path: '/login',
    element: (
      <PublicOnlyRoute>
        <LoginPage />
      </PublicOnlyRoute>
    ),
  },
  {
    path: '/register',
    element: (
      <PublicOnlyRoute>
        <RegisterPage />
      </PublicOnlyRoute>
    ),
  },
  {
    path: '/app',
    element: (
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/app/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'wallets',
        element: <WalletPage />,
      },
      {
        path: 'debts',
        element: <DebtPage />,
      },
      {
        path: 'debts/:debtId',
        element: <DebtDetailPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
