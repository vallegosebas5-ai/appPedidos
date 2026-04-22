/**
 * Usuarios de ejemplo pre-cargados.
 * Se usan como datos iniciales si no hay usuarios en localStorage.
 */
const defaultUsers = [
  {
    id: 1,
    name: 'Cliente Demo',
    email: 'demo@correo.com',
    password: '123456',
    role: 'cliente',
    phone: '555-0001',
    address: 'Av. Principal #123'
  }
];

export default defaultUsers;
