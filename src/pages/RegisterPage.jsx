import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService';
import './RegisterPage.css';

function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    role: 'cliente',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.name || !form.email || !form.password) {
      setError('Completa nombre, correo y contraseña.');
      return;
    }

    try {
      setLoading(true);
      const data = await registerUser(form);
      setSuccess(data.message || 'Registro exitoso.');

      setTimeout(() => {
        navigate('/login');
      }, 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="register-page">
      <section className="register-card">
        <div className="register-card__header">
          <h1>Crear Cuenta</h1>
          <p>Regístrate en FoodMarket B2B para comenzar a comprar o vender.</p>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="register-form__group">
            <label htmlFor="name">Nombre completo</label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Tu nombre completo"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="register-form__group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="ejemplo@correo.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="register-form__group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Crea una contraseña"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <div className="register-form__group">
            <label htmlFor="phone">Teléfono</label>
            <input
              id="phone"
              type="text"
              name="phone"
              placeholder="Tu número de teléfono"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div className="register-form__group">
            <label htmlFor="address">Dirección</label>
            <input
              id="address"
              type="text"
              name="address"
              placeholder="Tu dirección"
              value={form.address}
              onChange={handleChange}
            />
          </div>

          <div className="register-form__group">
            <label htmlFor="role">Tipo de cuenta</label>
            <select
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
            >
              <option value="cliente">Cliente</option>
              <option value="productor">Productor</option>
            </select>
          </div>

          {error && <p className="register-form__error">{error}</p>}
          {success && <p className="register-form__success">{success}</p>}

          <button
            type="submit"
            className="register-form__button"
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </form>

        <div className="register-card__footer">
          <p>
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default RegisterPage;
