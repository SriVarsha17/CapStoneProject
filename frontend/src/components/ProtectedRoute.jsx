import { Navigate } from 'react-router'
import { useAuth } from '../store/AuthStore.js'
import { pageBackground, loadingClass } from '../styles/common'

function ProtectedRoute({ children, allowedRoles = [] }) {
  const { loading, currentUser, isAuthenticated } = useAuth()

  if (loading) {
    return (
      <div className={`${pageBackground} flex min-h-[50vh] items-center justify-center`}>
        <p className={loadingClass}>Loading...</p>
      </div>
    )
  }

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
    const fallbackByRole = {
      user: '/user-dashboard',
      author: '/author-dashboard',
      admin: '/admin-dashboard',
    }

    return <Navigate to={fallbackByRole[currentUser.role] || '/login'} replace />
  }

  return children
}

export default ProtectedRoute