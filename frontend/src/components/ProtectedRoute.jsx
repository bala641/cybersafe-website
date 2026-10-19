import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading, isAdmin } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-cyan-500"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/" replace />
  }

  if (adminOnly && !isAdmin) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-red-900 border border-red-600 text-red-100 p-6 rounded">
          <p>You do not have access to this page.</p>
        </div>
      </div>
    )
  }

  return children
}
