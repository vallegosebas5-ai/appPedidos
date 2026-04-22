import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProductById, createProduct, updateProduct } from '../services/productService';
import Input from '../components/Input';
import Button from '../components/Button';
import './ProductFormPage.css';

function ProductFormPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image_url: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Redirigir a login si no es productor
    if (!user || user.role !== 'productor') {
      navigate('/');
      return;
    }

    if (isEditing) {
      loadProduct();
    }
  }, [id, user, navigate]);

  const loadProduct = async () => {
    setLoading(true);
    const prod = await getProductById(id);
    if (prod) {
      setForm({
        name: prod.name,
        description: prod.description || '',
        price: prod.price,
        stock: prod.stock,
        category: prod.category || '',
        image_url: prod.image_url || ''
      });
    } else {
      setError('Producto no encontrado.');
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const hasEnoughCoins = isEditing || (user.coins || 0) >= 10;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEditing) {
        await updateProduct(id, form);
      } else {
        await createProduct({ ...form, producer_id: user.id });
        login({ ...user, coins: user.coins - 10 }); // Update coins locally
      }
      navigate('/producer/dashboard');
    } catch (err) {
      setError('Ocurrió un error al guardar el producto.');
      setLoading(false);
    }
  };

  if (loading && isEditing && !form.name) return <div className="page container">Cargando...</div>;

  return (
    <div className="product-form-page">
      <div className="product-card">
        <div className="product-card__header">
          <h1>{isEditing ? 'Editar Producto' : 'Nuevo Producto'}</h1>
          <p>Completa los datos de tu producto. Si dejas el stock en 0, no será visible en la tienda.</p>
        </div>

        {/* Notificación de monedas */}
        {!isEditing && (
          <div className="message message--info" style={{marginBottom: '20px'}}>
            Costo de publicación: <strong>10 monedas</strong>. Saldo actual: <strong>{user.coins || 0}</strong>.
          </div>
        )}

        {error && <div className="message message--error">{error}</div>}
        {!hasEnoughCoins && !isEditing && (
          <div className="message message--error" style={{marginBottom: '20px'}}>
            No tienes suficientes monedas para publicar este producto.
          </div>
        )}

        <form className="product-form" onSubmit={handleSubmit}>
          <Input label="Nombre del Producto" name="name" value={form.name} onChange={handleChange} required />
          
          <div className="input-group">
            <label className="input-label">Descripción</label>
            <textarea 
              name="description" 
              value={form.description} 
              onChange={handleChange} 
              className="input-field" 
              rows="3"
            ></textarea>
          </div>

          <div style={{display:'flex', gap:'1rem'}}>
            <div style={{flex:1}}>
              <Input label="Precio ($)" type="number" step="0.01" name="price" value={form.price} onChange={handleChange} required />
            </div>
            <div style={{flex:1}}>
              <Input label="Stock Disponible" type="number" name="stock" value={form.stock} onChange={handleChange} required />
            </div>
          </div>

          <Input label="Categoría" name="category" value={form.category} onChange={handleChange} placeholder="Ej: Lácteos, Verduras, Café..." />
          <Input label="URL de Imagen" name="image_url" value={form.image_url} onChange={handleChange} placeholder="https://..." />

          <div className="product-form-actions">
            <Button type="button" variant="outline" fullWidth onClick={() => navigate('/producer/dashboard')}>
              Cancelar
            </Button>
            <Button type="submit" fullWidth disabled={loading || (!hasEnoughCoins && !isEditing)}>
              {loading ? 'Guardando...' : 'Guardar Producto'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductFormPage;
