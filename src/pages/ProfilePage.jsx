import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, updateProfile } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import './ProfilePage.css';

function ProfilePage() {
  const navigate = useNavigate();
  const { user, login, logout } = useAuth();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    role: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getProfile(user.id);

      const profileData = data.user || data;

      setForm({
        name: profileData.name || '',
        email: profileData.email || '',
        phone: profileData.phone || '',
        address: profileData.address || '',
        role: profileData.role || '',
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const data = await updateProfile(user.id, form);
      const updatedUser = data.user || { ...user, ...form };

      login(updatedUser);
      setSuccess(data.message || 'Perfil actualizado correctamente.');
      setEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <main className="profile-page">
      <section className="profile-card">
        <div className="profile-card__header">
          <div>
            <h1>Mi Perfil</h1>
            <p>Administra tu información personal dentro de FoodMarket B2B</p>
          </div>

          <div className="profile-card__actions">
            {!editing ? (
              <button
                type="button"
                className="profile-btn profile-btn--primary"
                onClick={() => setEditing(true)}
              >
                Editar perfil
              </button>
            ) : (
              <button
                type="button"
                className="profile-btn profile-btn--secondary"
                onClick={() => {
                  setEditing(false);
                  loadProfile();
                }}
              >
                Cancelar
              </button>
            )}

            <button
              type="button"
              className="profile-btn profile-btn--danger"
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          </div>
        </div>

        {loading ? (
          <p className="profile-message">Cargando perfil...</p>
        ) : (
          <form className="profile-form" onSubmit={handleSave}>
            <div className="profile-avatar">
              <div className="profile-avatar__circle">
                {form.name ? form.name.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>

            <div className="profile-grid">
              <div className="profile-group">
                <label>Nombre completo</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </div>

              <div className="profile-group">
                <label>Correo electrónico</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </div>

              <div className="profile-group">
                <label>Teléfono</label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </div>

              <div className="profile-group">
                <label>Dirección</label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </div>

              <div className="profile-group profile-group--full">
                <label>Rol</label>
                <input type="text" value={form.role || 'cliente'} disabled />
              </div>
            </div>

            {error && <p className="profile-alert profile-alert--error">{error}</p>}
            {success && (
              <p className="profile-alert profile-alert--success">{success}</p>
            )}

            {editing && (
              <button
                type="submit"
                className="profile-save"
                disabled={saving}
              >
                {saving ? 'Guardando...' : 'Guardar cambios'}
              </button>
            )}
          </form>
        )}
      </section>
    </main>
  );
}

export default ProfilePage;
