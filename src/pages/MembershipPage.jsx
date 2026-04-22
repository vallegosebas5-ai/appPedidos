import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { generateQRForMembership, confirmPayment, getMemberships } from '../services/paymentService';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import './MembershipPage.css';

function MembershipPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [memberships, setMemberships] = useState([]);
  const [qrImage, setQRImage] = useState(null);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [selectedMembership, setSelectedMembership] = useState(null);

  useEffect(() => {
    loadMemberships();
  }, []);

  const loadMemberships = async () => {
    try {
      const data = await getMemberships();
      setMemberships(data.memberships);
    } catch (err) {
      setError('Error al cargar membresías');
    }
  };

  if (!user || user.role !== 'productor') {
    return <div className="page container">Acceso denegado.</div>;
  }

  const handleBuyMembership = async (membership) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    setQRImage(null);
    
    try {
      const result = await generateQRForMembership(user.id, membership.id);
      
      setQRImage(result.qrImage);
      setCurrentTransaction(result.transactionId);
      setSelectedMembership(membership);
      setSuccess(`¡QR generado! Escanea para completar el pago de $${membership.price} USD`);
    } catch (err) {
      setError(err.message || 'Hubo un error al generar el QR.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!currentTransaction) return;
    
    setLoading(true);
    try {
      await confirmPayment(currentTransaction);
      login({ 
        ...user, 
        membership_type: selectedMembership.name,
      });
      setSuccess('¡Pago confirmado! Ahora tienes membresía ' + selectedMembership.name);
      setQRImage(null);
      setCurrentTransaction(null);
      setSelectedMembership(null);
    } catch (err) {
      setError(err.message || 'Error al confirmar el pago.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page container membership-page">
      <div className="membership-header">
        <h1>Membresías para Productores</h1>
        <p>Tu membresía actual: <strong className="membership-status">{user.membership_type || 'Gratuita'}</strong></p>
        <p className="membership-subtitle">Elige una membresía para acceder a más funcionalidades y desbloquear atribuciones.</p>
      </div>

      {error && <div className="message message--error" style={{maxWidth: '800px', margin: '0 auto 20px'}}>{error}</div>}
      {success && <div className="message message--success" style={{maxWidth: '800px', margin: '0 auto 20px'}}>{success}</div>}

      {qrImage && (
        <div className="qr-modal" style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          padding: '30px',
          maxWidth: '500px',
          margin: '20px auto',
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        }}>
          <h3>Código QR para Pago de Membresía</h3>
          <p style={{marginBottom: '20px', color: '#666'}}>
            {selectedMembership && `Plan: ${selectedMembership.name}`}
          </p>
          <img 
            src={qrImage} 
            alt="QR Code" 
            style={{
              maxWidth: '100%',
              width: '300px',
              height: '300px',
              marginBottom: '20px'
            }}
          />
          <div style={{marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px'}}>
            <p style={{margin: '0', fontSize: '14px', color: '#999'}}>Monto a pagar</p>
            <p style={{margin: '5px 0 0', fontSize: '18px', fontWeight: 'bold', color: '#333'}}>
              ${selectedMembership?.price.toFixed(2)} USD
            </p>
          </div>
          <Button 
            onClick={handleConfirmPayment}
            disabled={loading}
            fullWidth
            style={{marginBottom: '10px'}}
          >
            {loading ? 'Confirmando...' : 'Confirmar Pago'}
          </Button>
          <Button 
            variant="outline"
            onClick={() => {
              setQRImage(null);
              setCurrentTransaction(null);
              setSelectedMembership(null);
            }}
            fullWidth
          >
            Cancelar
          </Button>
        </div>
      )}

      <div className="memberships-container">
        {memberships.map((membership) => (
          <div key={membership.id} className="membership-card">
            <h2 className="membership-name">{membership.name}</h2>
            <p className="membership-description">{membership.description}</p>
            
            <div className="membership-features">
              <h4>Características:</h4>
              <ul>
                {membership.features && JSON.parse(membership.features).max_products && (
                  <li>Hasta {JSON.parse(membership.features).max_products} productos</li>
                )}
                {membership.features && JSON.parse(membership.features).featured && (
                  <li>✨ Productos destacados</li>
                )}
                {membership.features && JSON.parse(membership.features).support && (
                  <li>🎯 Soporte prioritario</li>
                )}
              </ul>
            </div>

            <div className="membership-price">${membership.price.toFixed(2)} USD/mes</div>
            
            <Button 
              type="button" 
              fullWidth 
              disabled={loading || user.membership_type === membership.name}
              onClick={() => handleBuyMembership(membership)}
              className="membership-btn"
            >
              {user.membership_type === membership.name 
                ? 'Membresía Actual' 
                : loading 
                ? 'Procesando...' 
                : 'Obtener Membresía'}
            </Button>
          </div>
        ))}
      </div>
      
      <div className="membership-footer">
        <Button variant="outline" onClick={() => navigate('/producer/dashboard')}>
          Volver al Panel
        </Button>
      </div>
    </div>
  );
}

export default MembershipPage;
