import './Button.css';

/**
 * Button - Componente de botón reutilizable.
 * 
 * Props:
 * - children: contenido del botón
 * - onClick: función al hacer click
 * - type: tipo del botón ('button', 'submit', 'reset')
 * - variant: estilo del botón ('primary', 'secondary', 'danger', 'outline')
 * - fullWidth: si ocupa todo el ancho disponible
 * - disabled: si el botón está deshabilitado
 */
function Button({ children, onClick, type = 'button', variant = 'primary', fullWidth = false, disabled = false }) {
  const classes = `btn btn--${variant} ${fullWidth ? 'btn--full' : ''}`;

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;
