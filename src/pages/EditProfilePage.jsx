import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';

function EditProfilePage() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await updateProfile(formData);
    setLoading(false);

    if (result.success) {
      navigate('/profile');
    } else {
      setError(result.message || 'Error al actualizar el perfil.');
    }
  };

  if (!user) return null;

  return (
    <div className="page container">
      <div className="auth-form-container">
        <h1>Editar Perfil</h1>
        <p className="auth-subtitle">Actualiza tus datos personales</p>

        {error && <div className="message message--error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <Input 
            label="Nombre Completo" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
          />
          <Input 
            label="Teléfono" 
            type="tel" 
            name="phone" 
            value={formData.phone} 
            onChange={handleChange} 
          />
          
          <div className="input-group">
            <label className="input-label" htmlFor="address">Dirección de Entrega</label>
            <textarea 
              id="address" 
              name="address" 
              value={formData.address} 
              onChange={handleChange} 
              className="input-field" 
              rows="3"
            ></textarea>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <Button type="button" variant="outline" fullWidth onClick={() => navigate('/profile')}>
              Cancelar
            </Button>
            <Button type="submit" fullWidth disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfilePage;
