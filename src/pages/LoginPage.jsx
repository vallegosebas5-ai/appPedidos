import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
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

    if (!form.email || !form.password) {
      setError('Completa correo y contraseña.');
      return;
    }

    try {
      setLoading(true);
      const data = await loginUser(form);

      login(data.user);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-card__header">
          <h1>Iniciar Sesión</h1>
          <p>Ingresa a tu cuenta para continuar en FoodMarket B2B</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-form__group">
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

          <div className="login-form__group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Ingresa tu contraseña"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          {error && <p className="login-form__error">{error}</p>}

          <button type="submit" className="login-form__button" disabled={loading}>
            {loading ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="login-card__footer">
          <p>
            ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default LoginPage;
