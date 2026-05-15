import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/layout/PrivateRoute'
import WhatsAppButton from './components/ui/WhatsAppButton'

// Home
import Home from './pages/Home'

// Auth
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

// Router inteligente por rol
import Dashboard from './pages/Dashboard'

// Admin
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminCoins from './pages/admin/AdminCoins'
import AdminOrders from './pages/admin/AdminOrders'
import ComingSoon from './components/ui/ComingSoon'

// Seller
import SellerDashboard from './pages/seller/SellerDashboard'
import SellerProducts from './pages/seller/SellerProducts'
import SellerCoins from './pages/seller/SellerCoins'
import SellerOrders from './pages/seller/SellerOrders'

// Profile
import EditProfile from './pages/profile/EditProfile'
import AdminSettings from './pages/admin/AdminSettings'

// Buyer
import BuyerDashboard from './pages/buyer/BuyerDashboard'
import BuyerCatalog from './pages/buyer/BuyerCatalog'
import BuyerCart from './pages/buyer/BuyerCart'
import BuyerCheckout from './pages/buyer/BuyerCheckout'
import BuyerOrders from './pages/buyer/BuyerOrders'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <WhatsAppButton />
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Redirige al dashboard según rol */}
          <Route path="/dashboard" element={
            <PrivateRoute><Dashboard /></PrivateRoute>
          } />

          {/* Perfil (todos los roles) */}
          <Route path="/profile/edit" element={
            <PrivateRoute><EditProfile /></PrivateRoute>
          } />

          {/* Admin */}
          <Route path="/admin" element={
            <PrivateRoute allowedRoles={['admin']}><AdminDashboard /></PrivateRoute>
          } />
          <Route path="/admin/users" element={
            <PrivateRoute allowedRoles={['admin']}><AdminUsers /></PrivateRoute>
          } />
          <Route path="/admin/coins" element={
            <PrivateRoute allowedRoles={['admin']}><AdminCoins /></PrivateRoute>
          } />
          <Route path="/admin/orders" element={
            <PrivateRoute allowedRoles={['admin']}><AdminOrders /></PrivateRoute>
          } />
          <Route path="/admin/settings" element={
            <PrivateRoute allowedRoles={['admin']}><AdminSettings /></PrivateRoute>
          } />

          {/* Seller */}
          <Route path="/seller" element={
            <PrivateRoute allowedRoles={['vendedor']}><SellerDashboard /></PrivateRoute>
          } />
          <Route path="/seller/products" element={
            <PrivateRoute allowedRoles={['vendedor']}><SellerProducts /></PrivateRoute>
          } />
          <Route path="/seller/orders" element={
            <PrivateRoute allowedRoles={['vendedor']}><SellerOrders /></PrivateRoute>
          } />
          <Route path="/seller/coins" element={
            <PrivateRoute allowedRoles={['vendedor']}><SellerCoins /></PrivateRoute>
          } />

          {/* Buyer */}
          <Route path="/buyer" element={
            <PrivateRoute allowedRoles={['comprador']}><BuyerDashboard /></PrivateRoute>
          } />
          <Route path="/buyer/catalog" element={
            <PrivateRoute allowedRoles={['comprador']}><BuyerCatalog /></PrivateRoute>
          } />
          <Route path="/buyer/cart" element={
            <PrivateRoute allowedRoles={['comprador']}><BuyerCart /></PrivateRoute>
          } />
          <Route path="/buyer/checkout" element={
            <PrivateRoute allowedRoles={['comprador']}><BuyerCheckout /></PrivateRoute>
          } />
          <Route path="/buyer/orders" element={
            <PrivateRoute allowedRoles={['comprador']}><BuyerOrders /></PrivateRoute>
          } />

          {/* Default */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
