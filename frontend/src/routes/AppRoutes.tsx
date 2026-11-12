import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from '../features/auth/components/ProtectedRoute'
import LoginPage from '../features/auth/pages/LoginPage'
import RegisterPage from '../features/auth/pages/RegisterPage'
import DashboardPage from '../features/dashboard/pages/DashboardPage'
import LandingPage from '../features/landing/pages/LandingPage'
import ShopsPage from '../features/shops/pages/ShopsPage'
import DashboardLayout from '../layouts/DashboardLayout'
import MarketingLayout from '../layouts/MarketingLayout'
import PublicLayout from '../layouts/PublicLayout'
import NotFoundPage from './NotFoundPage'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MarketingLayout />}>
        <Route path="/" element={<LandingPage />} />
      </Route>

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<PublicLayout />}>
        <Route path="/shops" element={<ShopsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
      </Route>
    </Routes>
  )
}
