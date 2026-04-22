import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProductsByProducer } from '../services/productService';
import { getOrdersByProducer } from '../services/orderService';
import Button from '../components/Button';
import './ProducerDashboardPage.css';

function ProducerDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Protección de ruta
    if (!user || user.role !== 'productor') {
      navigate('/');
      return;
    }

    loadDashboardData();
  }, [user, navigate]);

  const loadDashboardData = async () => {
    setLoading(true);
    const prodData = await getProductsByProducer(user.id);
    const ordData = await getOrdersByProducer(user.id);
    setProducts(prodData || []);
    setOrders(ordData || []);
    setLoading(false);
  };

  if (!user || user.role !== 'productor') return null;

  return (
    <div className="page container">
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Panel de Productor</h1>
          <p>Bienvenido, {user.name}. Gestiona tu catálogo y revisa tus ventas.</p>
        </div>
        <div style={{ textAlign: 'right', background: 'var(--color-white)', padding: '15px 25px', borderRadius: 'var(--border-radius)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border)' }}>
          <p style={{ margin: 0, color: 'var(--color-text-light)', fontSize: '0.9rem' }}>Saldo Total</p>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
            {user.coins || 0} <span style={{ fontSize: '1rem', fontWeight: 'normal' }}>monedas</span>
          </div>
          <Link to="/producer/coins">
            <Button size="small" style={{ marginTop: '10px' }}>Recargar Monedas</Button>
          </Link>
          <hr style={{ margin: '15px 0', border: 'none', borderTop: '1px solid var(--color-border)' }} />
          <p style={{ margin: '10px 0 5px', color: 'var(--color-text-light)', fontSize: '0.9rem' }}>Membresía Actual</p>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
            {user.membership_type || 'Gratuita'}
          </div>
          <Link to="/producer/membership">
            <Button size="small" variant="outline" style={{ marginTop: '10px', width: '100%' }}>Actualizar Membresía</Button>
          </Link>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          🏷️ Mis Productos
        </button>
        <button 
          className={`tab-btn ${activeTab === 'sales' ? 'active' : ''}`}
          onClick={() => setActiveTab('sales')}
        >
          💰 Mis Ventas
        </button>
      </div>

      <div className="dashboard-content">
        {loading ? (
          <p>Cargando información del panel...</p>
        ) : activeTab === 'products' ? (
          <div className="products-section">
            <div className="section-header">
              <h2>Catálogo de Productos</h2>
              <Link to="/producer/product/new">
                <Button>+ Crear Nuevo Producto</Button>
              </Link>
            </div>
            
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Nombre</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? products.map(p => (
                  <tr key={p.id}>
                    <td>
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.name} width="50" style={{borderRadius: '8px', objectFit: 'cover'}}/>
                      ) : (
                        '📷'
                      )}
                    </td>
                    <td>{p.name}</td>
                    <td>${Number(p.price).toFixed(2)}</td>
                    <td>{p.stock}</td>
                    <td>
                      {p.stock > 0 
                        ? <span className="badge badge-active">Activo</span> 
                        : <span className="badge badge-inactive">Sin Stock (Oculto)</span>
                      }
                    </td>
                    <td>
                      <Link to={`/producer/product/edit/${p.id}`}>
                        <Button variant="outline" size="small">Editar</Button>
                      </Link>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" style={{textAlign: 'center', padding: '2rem'}}>
                      Aún no has creado ningún producto.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="sales-section">
            <div className="section-header">
              <h2>Historial de Ventas</h2>
            </div>
            
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Orden #</th>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>Modo Entrega</th>
                  <th>Estado</th>
                  <th>Detalle Completo</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? orders.map(o => (
                  <tr key={o.id}>
                    <td>#{o.id}</td>
                    <td>{new Date(o.created_at).toLocaleDateString()}</td>
                    <td>{o.buyer_name}</td>
                    <td>{o.delivery_type}</td>
                    <td><span className="badge badge-active">{o.status}</span></td>
                    <td>
                      <Link to={`/order/${o.id}`}>
                        <Button variant="outline" size="small">Ver Recibo</Button>
                      </Link>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" style={{textAlign: 'center', padding: '2rem'}}>
                      Aún no tienes ventas registradas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProducerDashboardPage;
