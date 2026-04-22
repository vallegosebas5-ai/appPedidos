import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '../services/orderService';
import Button from '../components/Button';
import './EstadoPedidoPage.css';

function EstadoPedidoPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      const data = await getOrderById(orderId);
      if (data) {
        setOrder(data);
      } else {
        setError('No pudimos encontrar el pedido solicitado.');
      }
      setLoading(false);
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return <div className="page container"><p style={{textAlign:'center'}}>Cargando datos del pedido...</p></div>;
  }

  if (error || !order) {
    return (
      <div className="page container">
        <div className="order-status-card">
          <h2>Pedido no encontrado</h2>
          <p>{error}</p>
          <Link to="/"><Button>Volver al inicio</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page container">
      <div className="order-status-card">
        <div className="order-status-header">
          <h1>¡Pedido Confirmado! 🎉</h1>
          <p className="order-number">Pedido #{order.id}</p>
          <div className={`status-badge status-${order.status}`}>
            Estado actual: {order.status.toUpperCase()}
          </div>
        </div>

        <div className="order-info-grid">
          <div className="order-info-box">
            <h3>Detalles de Entrega</h3>
            <p><strong>Modo:</strong> {order.delivery_type === 'delivery' ? 'Entrega a domicilio' : 'Recogida en tienda'}</p>
            <p><strong>Fecha pedido:</strong> {new Date(order.created_at).toLocaleString()}</p>
          </div>
          
          <div className="order-info-box">
            <h3>Resumen Financiero</h3>
            <p><strong>Total pagado:</strong> ${Number(order.total).toFixed(2)}</p>
            <p>Cantidad de items: {order.items?.length || 0}</p>
          </div>
        </div>

        <div className="order-items-list">
          <h3>Productos en el pedido</h3>
          <table className="order-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cant.</th>
                <th>Precio Unit.</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map(item => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>${Number(item.unit_price).toFixed(2)}</td>
                  <td>${(item.quantity * item.unit_price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="order-actions">
          <Link to="/">
            <Button variant="outline">Volver al Catálogo</Button>
          </Link>
          <Link to="/profile">
            <Button>Ver Mis Pedidos</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default EstadoPedidoPage;
