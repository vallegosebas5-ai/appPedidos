import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/orderService';
import './CheckoutPage.css';

const PAYMENT_METHODS = [
  { id: 'efectivo', label: 'Efectivo', icon: '💵', desc: 'Pagás al recibir el pedido.' },
  { id: 'transferencia', label: 'Transferencia / QR', icon: '📲', desc: 'Escaneá el QR o transferí al alias.' },
  { id: 'monedas', label: 'Monedas virtuales', icon: '🪙', desc: 'Usás tu saldo de monedas de la app.' },
];

function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [deliveryType, setDeliveryType] = useState('delivery');
  const [paymentMethod, setPaymentMethod] = useState('efectivo');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const subtotal = cart.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0);
  const deliveryCost = deliveryType === 'delivery' ? 5.00 : 0;
  const total = subtotal + deliveryCost;

  const handleOrder = async () => {
    if (!user) {
      setError('Debes iniciar sesión para completar el pedido.');
      return;
    }
    if (!cart || cart.length === 0) {
      setError('Tu carrito está vacío.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const payload = {
        user_id: user.id,
        total,
        type: deliveryType,
        payment_method: paymentMethod,
        items: cart.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          price: Number(item.price),
        })),
      };

      const result = await createOrder(payload);
      setSuccess(result.message || 'Pedido creado correctamente.');
      clearCart();

      setTimeout(() => navigate('/orders'), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="checkout-page">
      <section className="checkout-card">
        <h1 className="checkout-title">Resumen del pedido</h1>

        {!user && (
          <p className="checkout-warning">
            Debes iniciar sesión para completar tu compra.
          </p>
        )}

        {cart.length === 0 ? (
          <div className="checkout-empty">
            <p>No hay productos en el carrito.</p>
            <Link to="/cart" className="checkout-link">Volver al carrito</Link>
          </div>
        ) : (
          <>
            {/* ── Productos ── */}
            <div className="checkout-section">
              <h2 className="checkout-section__title">Productos</h2>
              <div className="checkout-list">
                {cart.map((item) => (
                  <div key={item.id} className="checkout-item">
                    <img
                      src={item.image || 'https://via.placeholder.com/80x80?text=Prod'}
                      alt={item.name}
                      className="checkout-item__image"
                    />
                    <div className="checkout-item__info">
                      <span className="checkout-item__name">{item.name}</span>
                      <span className="checkout-item__meta">{item.category}</span>
                      <span className="checkout-item__meta">
                        {item.quantity} × ${Number(item.price).toFixed(2)}
                      </span>
                    </div>
                    <span className="checkout-item__subtotal">
                      ${(Number(item.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Tipo de entrega ── */}
            <div className="checkout-section">
              <h2 className="checkout-section__title">Tipo de entrega</h2>
              <div className="checkout-delivery-options">
                {[
                  { id: 'delivery', label: 'Delivery', extra: '+ $5.00' },
                  { id: 'pickup', label: 'Retiro en local', extra: 'Gratis' },
                ].map((opt) => (
                  <label
                    key={opt.id}
                    className={`checkout-option ${deliveryType === opt.id ? 'checkout-option--active' : ''}`}
                  >
                    <input
                      type="radio"
                      name="delivery"
                      value={opt.id}
                      checked={deliveryType === opt.id}
                      onChange={() => setDeliveryType(opt.id)}
                    />
                    <span className="checkout-option__label">{opt.label}</span>
                    <span className="checkout-option__badge">{opt.extra}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* ── Método de pago ── */}
            <div className="checkout-section">
              <h2 className="checkout-section__title">Método de pago</h2>
              <div className="checkout-payment-options">
                {PAYMENT_METHODS.map((m) => (
                  <label
                    key={m.id}
                    className={`checkout-option checkout-option--payment ${paymentMethod === m.id ? 'checkout-option--active' : ''}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={m.id}
                      checked={paymentMethod === m.id}
                      onChange={() => setPaymentMethod(m.id)}
                    />
                    <span className="checkout-option__icon">{m.icon}</span>
                    <div>
                      <span className="checkout-option__label">{m.label}</span>
                      <span className="checkout-option__desc">{m.desc}</span>
                    </div>
                  </label>
                ))}
              </div>

              {/* QR de pago */}
              {paymentMethod === 'transferencia' && (
                <div className="checkout-qr">
                  <p className="checkout-qr__title">Escaneá para pagar</p>
                  <img
                    src="/qr-pago.png"
                    alt="QR de pago"
                    className="checkout-qr__img"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="checkout-qr__placeholder" style={{ display: 'none' }}>
                    <span>📷</span>
                    <p>Colocá tu QR en<br /><strong>public/qr-pago.png</strong></p>
                  </div>
                  <p className="checkout-qr__alias">Alias: <strong>TU.ALIAS.MP</strong></p>
                  <p className="checkout-qr__note">
                    Una vez que realices la transferencia, confirmá el pedido.
                  </p>
                </div>
              )}

              {paymentMethod === 'monedas' && (
                <div className="checkout-coins-info">
                  <span>🪙</span>
                  <p>Saldo disponible: <strong>{user?.coins ?? 0} monedas</strong></p>
                  {(user?.coins ?? 0) < total && (
                    <p className="checkout-coins-warn">
                      No tenés saldo suficiente.{' '}
                      <Link to="/buy-coins">Comprar monedas</Link>
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* ── Totales ── */}
            <div className="checkout-section checkout-totals">
              <div className="checkout-totals__row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="checkout-totals__row">
                <span>Envío</span>
                <span>{deliveryCost > 0 ? `$${deliveryCost.toFixed(2)}` : 'Gratis'}</span>
              </div>
              <div className="checkout-totals__row checkout-totals__row--total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {error && <p className="checkout-error">{error}</p>}
            {success && <p className="checkout-success">{success}</p>}

            <button
              className="checkout-button"
              onClick={handleOrder}
              disabled={loading || !user}
            >
              {loading ? 'Procesando...' : 'Confirmar pedido'}
            </button>
          </>
        )}
      </section>
    </main>
  );
}

export default CheckoutPage;
