import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { generateQRForCoins, confirmPayment } from '../services/paymentService';
import './BuyCoinsPage.css';

const PACKAGES = [
  { id: 'basico',        coins: 50,  price: 5,  label: 'Básico',       desc: '5 publicaciones' },
  { id: 'recomendado',   coins: 100, price: 9,  label: 'Recomendado',  desc: '10 publicaciones', popular: true },
  { id: 'profesional',   coins: 500, price: 40, label: 'Profesional',  desc: '50 publicaciones' },
];

const EMPTY_CARD = { name: '', number: '', expiry: '', cvv: '' };

function BuyCoinsPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [selected, setSelected]           = useState(null);
  const [payMethod, setPayMethod]         = useState('qr');   // 'qr' | 'tarjeta'
  const [card, setCard]                   = useState(EMPTY_CARD);
  const [qrImage, setQrImage]             = useState(null);
  const [transactionId, setTransactionId] = useState(null);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState('');
  const [success, setSuccess]             = useState('');

  if (!user || user.role !== 'productor') {
    return <div className="page container">Acceso denegado.</div>;
  }

  const coins = user.coins || 0;

  /* ── helpers ── */
  const formatCardNumber = (v) =>
    v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

  const formatExpiry = (v) => {
    const d = v.replace(/\D/g, '').slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCard((prev) => ({
      ...prev,
      [name]:
        name === 'number' ? formatCardNumber(value) :
        name === 'expiry' ? formatExpiry(value) :
        name === 'cvv'    ? value.replace(/\D/g, '').slice(0, 4) :
        value,
    }));
  };

  const handleSelectPackage = (pkg) => {
    setSelected(pkg);
    setQrImage(null);
    setTransactionId(null);
    setError('');
    setSuccess('');
  };

  /* ── pago QR ── */
  const handleGenerateQR = async () => {
    if (!selected) return;
    setLoading(true);
    setError('');
    try {
      const res = await generateQRForCoins(user.id, selected.coins, selected.price);
      setQrImage(res.qrImage);
      setTransactionId(res.transactionId);
    } catch (err) {
      setError(err.message || 'Error al generar el QR.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmQR = async () => {
    setLoading(true);
    setError('');
    try {
      await confirmPayment(transactionId);
      const newCoins = coins + selected.coins;
      login({ ...user, coins: newCoins });
      setSuccess(`¡Pago confirmado! Recibiste ${selected.coins} monedas.`);
      setQrImage(null);
      setTransactionId(null);
      setSelected(null);
    } catch (err) {
      setError(err.message || 'Error al confirmar el pago.');
    } finally {
      setLoading(false);
    }
  };

  /* ── pago tarjeta ── */
  const handlePayCard = async (e) => {
    e.preventDefault();
    if (!card.name || !card.number || !card.expiry || !card.cvv) {
      setError('Completá todos los datos de la tarjeta.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await confirmPayment('card-' + Date.now());
      const newCoins = coins + selected.coins;
      login({ ...user, coins: newCoins });
      setSuccess(`¡Pago con tarjeta aprobado! Recibiste ${selected.coins} monedas.`);
      setCard(EMPTY_CARD);
      setSelected(null);
    } catch (err) {
      setError(err.message || 'Error al procesar la tarjeta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="coins-page">

      {/* ── Banner de saldo ── */}
      <div className="coins-hero">
        <div className="coins-hero__icon">🪙</div>
        <div>
          <h1 className="coins-hero__title">Monedas</h1>
          <p className="coins-hero__sub">Saldo disponible</p>
        </div>
        <div className="coins-hero__balance">{coins}</div>
      </div>

      <div className="coins-info-bar">
        Publicar un producto cuesta <strong>10 monedas</strong> · Con tu saldo podés publicar{' '}
        <strong>{Math.floor(coins / 10)}</strong> producto{Math.floor(coins / 10) !== 1 ? 's' : ''} más.
      </div>

      {error   && <div className="coins-msg coins-msg--error">{error}</div>}
      {success && <div className="coins-msg coins-msg--success">{success}</div>}

      {/* ── Paquetes ── */}
      <h2 className="coins-section-title">Elegí un paquete</h2>
      <div className="packages-grid">
        {PACKAGES.map((pkg) => (
          <button
            key={pkg.id}
            className={`pkg-card ${pkg.popular ? 'pkg-card--popular' : ''} ${selected?.id === pkg.id ? 'pkg-card--selected' : ''}`}
            onClick={() => handleSelectPackage(pkg)}
          >
            {pkg.popular && <span className="pkg-badge">Mejor valor</span>}
            <div className="pkg-coins">{pkg.coins}</div>
            <div className="pkg-coins-label">monedas</div>
            <div className="pkg-label">{pkg.label}</div>
            <div className="pkg-desc">{pkg.desc}</div>
            <div className="pkg-price">${pkg.price}.00 USD</div>
          </button>
        ))}
      </div>

      {/* ── Panel de pago (aparece al seleccionar un paquete) ── */}
      {selected && !success && (
        <div className="payment-panel">
          <h2 className="payment-panel__title">
            Pagar {selected.coins} monedas — ${selected.price}.00 USD
          </h2>

          {/* Selector de método */}
          <div className="payment-methods">
            <label className={`pay-method ${payMethod === 'qr' ? 'pay-method--active' : ''}`}>
              <input type="radio" name="payMethod" value="qr" checked={payMethod === 'qr'}
                onChange={() => { setPayMethod('qr'); setQrImage(null); setTransactionId(null); }} />
              <span className="pay-method__icon">📲</span>
              <span className="pay-method__label">Transferencia / QR</span>
            </label>
            <label className={`pay-method ${payMethod === 'tarjeta' ? 'pay-method--active' : ''}`}>
              <input type="radio" name="payMethod" value="tarjeta" checked={payMethod === 'tarjeta'}
                onChange={() => { setPayMethod('tarjeta'); setQrImage(null); setTransactionId(null); }} />
              <span className="pay-method__icon">💳</span>
              <span className="pay-method__label">Tarjeta de crédito/débito</span>
            </label>
          </div>

          {/* ── QR ── */}
          {payMethod === 'qr' && (
            <div className="qr-panel">
              {!qrImage ? (
                <button className="coins-btn" onClick={handleGenerateQR} disabled={loading}>
                  {loading ? 'Generando...' : 'Generar QR de pago'}
                </button>
              ) : (
                <>
                  <p className="qr-panel__hint">Escaneá con tu app de pagos y luego confirmá.</p>
                  <img src={qrImage} alt="QR pago" className="qr-panel__img"
                    onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
                  <div className="qr-panel__fallback" style={{display:'none'}}>
                    <span>📷</span><p>Imagen QR no disponible.<br/>El backend debe devolver <code>qrImage</code>.</p>
                  </div>
                  <p className="qr-panel__txid">TX: <strong>#{transactionId}</strong></p>
                  <div className="qr-panel__actions">
                    <button className="coins-btn" onClick={handleConfirmQR} disabled={loading}>
                      {loading ? 'Confirmando...' : 'Ya pagué — Confirmar'}
                    </button>
                    <button className="coins-btn coins-btn--outline"
                      onClick={() => { setQrImage(null); setTransactionId(null); }}>
                      Cancelar
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── Tarjeta ── */}
          {payMethod === 'tarjeta' && (
            <form className="card-form" onSubmit={handlePayCard}>
              <div className="card-preview">
                <div className="card-preview__chip">▬▬</div>
                <div className="card-preview__number">
                  {card.number || '•••• •••• •••• ••••'}
                </div>
                <div className="card-preview__footer">
                  <span>{card.name || 'NOMBRE APELLIDO'}</span>
                  <span>{card.expiry || 'MM/AA'}</span>
                </div>
              </div>

              <div className="card-fields">
                <div className="card-field card-field--full">
                  <label>Nombre en la tarjeta</label>
                  <input name="name" value={card.name}
                    onChange={handleCardChange} placeholder="Ej: Juan Pérez" />
                </div>
                <div className="card-field card-field--full">
                  <label>Número de tarjeta</label>
                  <input name="number" value={card.number}
                    onChange={handleCardChange} placeholder="1234 5678 9012 3456"
                    inputMode="numeric" />
                </div>
                <div className="card-field">
                  <label>Vencimiento</label>
                  <input name="expiry" value={card.expiry}
                    onChange={handleCardChange} placeholder="MM/AA" inputMode="numeric" />
                </div>
                <div className="card-field">
                  <label>CVV</label>
                  <input name="cvv" value={card.cvv}
                    onChange={handleCardChange} placeholder="123"
                    inputMode="numeric" type="password" />
                </div>
              </div>

              <button type="submit" className="coins-btn" disabled={loading}>
                {loading ? 'Procesando...' : `Pagar $${selected.price}.00 USD`}
              </button>
            </form>
          )}
        </div>
      )}

      <div className="coins-footer">
        <button className="coins-btn coins-btn--outline" onClick={() => navigate('/producer/dashboard')}>
          ← Volver al panel
        </button>
      </div>
    </div>
  );
}

export default BuyCoinsPage;
