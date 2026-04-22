import { Link } from 'react-router-dom';
import '../pages/LoginPage.css';

function ForgotPasswordPage() {
  return (
    <div className="page container">
      <div className="auth-form-container">
        <h1>Recuperar Contraseña</h1>
        <p className="auth-subtitle">Te enviaremos instrucciones a tu correo</p>
        {/* Formulario se implementará en FASE 3 */}
        <p>Formulario de recuperación próximamente...</p>
        <div className="auth-links">
          <Link to="/login">Volver al inicio de sesión</Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
