import './Input.css';

/**
 * Input - Componente de entrada de texto reutilizable.
 * 
 * Props:
 * - label: texto de la etiqueta
 * - type: tipo de input ('text', 'email', 'password', 'number', 'tel')
 * - name: nombre del campo
 * - value: valor actual
 * - onChange: función al cambiar
 * - placeholder: texto de placeholder
 * - required: si es campo obligatorio
 * - error: mensaje de error a mostrar
 */
function Input({ label, type = 'text', name, value, onChange, placeholder, required = false, error }) {
  return (
    <div className="input-group">
      {label && (
        <label htmlFor={name} className="input-label">
          {label} {required && <span className="input-required">*</span>}
        </label>
      )}
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`input-field ${error ? 'input-field--error' : ''}`}
      />
      {error && <span className="input-error">{error}</span>}
    </div>
  );
}

export default Input;
