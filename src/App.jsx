import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomeClientePage from './pages/HomeClientePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import ProfilePage from './pages/ProfilePage';
import ProducerDashboardPage from './pages/ProducerDashboardPage';
import ProductFormPage from './pages/ProductFormPage';
import BuyCoinsPage from './pages/BuyCoinsPage';
import MembershipPage from './pages/MembershipPage';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomeClientePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/producer/dashboard" element={<ProducerDashboardPage />} />
        <Route path="/producer/coins" element={<BuyCoinsPage />} />
        <Route path="/producer/membership" element={<MembershipPage />} />
        <Route path="/producer/product/new" element={<ProductFormPage />} />
        <Route path="/producer/product/edit/:id" element={<ProductFormPage />} />
      </Routes>
    </>
  );
}

export default App;