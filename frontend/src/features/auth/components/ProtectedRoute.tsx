import { Navigate, Outlet } from 'react-router-dom'
import { isLoggedIn } from '../../../lib/token'

/** Wraps pages that need a logged-in user. */
export default function ProtectedRoute() {
  return isLoggedIn() ? <Outlet /> : <Navigate to="/login" replace />
}
