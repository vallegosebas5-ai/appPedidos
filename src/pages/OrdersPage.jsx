import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserOrders } from '../services/orderService';
import './OrdersPage.css';

function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const loadOrders = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getUserOrders(user.id);
        setOrders(data);
      } catch (err) {
        setError(err.message);
        console.error('Error al cargar pedidos:', err);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user]);

  return (
    <main className="orders-page">
      <section className="orders-card">
        <h1>Mis Pedidos</h1>

        {!user && <p>Debes iniciar sesión para ver tus pedidos.</p>}
        {loading && user && <p>Cargando pedidos...</p>}
        {error && <p className="orders-error">{error}</p>}

        {!loading && user && !error && orders.length === 0 && (
          <p>No tienes pedidos todavía.</p>
        )}

        {!loading && orders.length > 0 && (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-item">
                <h3>Pedido #{order.id}</h3>
                <p>Total: ${Number(order.total).toFixed(2)}</p>
                <p>Tipo: {order.type}</p>
                <p>Estado: {order.status}</p>
                <p>Fecha: {new Date(order.created_at).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default OrdersPage;
