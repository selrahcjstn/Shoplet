import { Route, Routes } from 'react-router-dom'
import AnalyticsPage from '../features/analytics/pages/AnalyticsPage'
import ProtectedRoute from '../features/auth/components/ProtectedRoute'
import LoginPage from '../features/auth/pages/LoginPage'
import RegisterPage from '../features/auth/pages/RegisterPage'
import CategoriesPage from '../features/categories/pages/CategoriesPage'
import DashboardPage from '../features/dashboard/pages/DashboardPage'
import LandingPage from '../features/landing/pages/LandingPage'
import ProductsPage from '../features/products/pages/ProductsPage'
import MyShopPage from '../features/shops/pages/MyShopPage'
import StorefrontPage from '../features/storefront/pages/StorefrontPage'
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

      {/* The page customers see when a seller shares their link. It has its own header and footer. */}
      <Route path="/s/:slug" element={<StorefrontPage />} />

      <Route element={<PublicLayout />}>
        <Route path="/shops" element={<ShopsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/shop" element={<MyShopPage />} />
          <Route path="/dashboard/products" element={<ProductsPage />} />
          <Route path="/dashboard/categories" element={<CategoriesPage />} />
          <Route path="/dashboard/analytics" element={<AnalyticsPage />} />
        </Route>
      </Route>
    </Routes>
  )
}
