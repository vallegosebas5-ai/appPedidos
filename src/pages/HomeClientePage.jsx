import { useEffect, useState } from 'react';
import './HomeClientePage.css';
import { getProducts, searchProducts } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const categories = [
  { id: 1, icon: '🥬', title: 'Vegetales' },
  { id: 2, icon: '🍎', title: 'Frutas' },
  { id: 3, icon: '🧀', title: 'Lácteos' },
  { id: 4, icon: '🥩', title: 'Carnes' },
  { id: 5, icon: '🥖', title: 'Panadería' },
  { id: 6, icon: '🐟', title: 'Pescados' },
];

const reasons = [
  {
    id: 1,
    icon: '🍃',
    title: 'Productos Frescos',
    text: 'Directamente de productores locales certificados',
  },
  {
    id: 2,
    icon: '🚚',
    title: 'Entrega Rápida',
    text: 'Delivery o recoge en punto de venta',
  },
  {
    id: 3,
    icon: '🛡️',
    title: 'Calidad Garantizada',
    text: 'Productos verificados y de alta calidad',
  },
  {
    id: 4,
    icon: '⭐',
    title: 'Productores Confiables',
    text: 'Sistema de calificaciones y reseñas',
  },
];

const steps = [
  {
    id: '01',
    title: 'Regístrate',
    text: 'Crea tu cuenta como cliente o productor',
  },
  {
    id: '02',
    title: 'Explora',
    text: 'Navega por categorías y productores destacados',
  },
  {
    id: '03',
    title: 'Compra',
    text: 'Agrega productos al carrito y realiza tu pedido',
  },
  {
    id: '04',
    title: 'Recibe',
    text: 'Recibe tus productos frescos en tu restaurante',
  },
];

function HomeClientePage() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoadingProducts(true);
      setError('');
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearch(value);

    try {
      setError('');

      if (!value.trim()) {
        await loadProducts();
        return;
      }

      const result = await searchProducts(value);
      setProducts(result);
    } catch (err) {
      setError(err.message);
    }
  };

  if (user?.role === 'productor') {
    return <Navigate to="/producer/dashboard" replace />;
  }

  return (
    <main className="home">
      <section className="hero">
        <div className="hero__container">
          <div className="hero__content">
            <h1>Conectamos Restaurantes con Productores Locales</h1>
            <p>
              La plataforma B2B líder para la compra y venta de productos
              alimenticios frescos y de calidad.
            </p>

            <div className="hero__actions">
              <a href="/register" className="hero__btn hero__btn--primary">
                ↗ Comenzar Ahora
              </a>
              <a href="/login" className="hero__btn hero__btn--secondary">
                Iniciar Sesión
              </a>
            </div>
          </div>

          <div className="hero__image-wrapper">
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80"
              alt="Productos frescos"
              className="hero__image"
            />
          </div>
        </div>
      </section>

      <section className="section section--light">
        <div className="container">
          <h2 className="section__title">Categorías Principales</h2>

          <div className="categories">
            {categories.map((category) => (
              <article key={category.id} className="category-card">
                <div className="category-card__icon">{category.icon}</div>
                <h3>{category.title}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--beige">
        <div className="container">
          <h2 className="section__title">¿Por qué elegirnos?</h2>

          <div className="reasons">
            {reasons.map((reason) => (
              <article key={reason.id} className="reason-card">
                <div className="reason-card__icon">{reason.icon}</div>
                <h3>{reason.title}</h3>
                <p>{reason.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--light">
        <div className="container">
          <h2 className="section__title">Productos Disponibles</h2>

          <div style={{ marginBottom: '24px' }}>
            <input
              type="text"
              placeholder="Buscar productos por nombre o categoría..."
              value={search}
              onChange={handleSearch}
              style={{
                width: '100%',
                maxWidth: '460px',
                height: '48px',
                padding: '0 14px',
                borderRadius: '14px',
                border: '1px solid rgba(60,0,0,0.18)',
                outline: 'none',
                fontSize: '1rem',
              }}
            />
          </div>

          {loadingProducts && <p>Cargando productos...</p>}
          {error && <p>{error}</p>}

          {!loadingProducts && !error && products.length === 0 && (
            <p>No hay productos disponibles.</p>
          )}

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px',
            }}
          >
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section section--light">
        <div className="container">
          <h2 className="section__title">¿Cómo Funciona?</h2>

          <div className="steps">
            {steps.map((step, index) => (
              <div key={step.id} className="step-wrapper">
                <article className="step-card">
                  <span className="step-card__number">{step.id}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </article>

                {index < steps.length - 1 && (
                  <div className="step-arrow">›</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container cta__container">
          <div className="cta__icon">▣</div>
          <h2>¿Listo para empezar?</h2>
          <p>
            Únete a la comunidad de restaurantes y productores que confían en
            FoodMarket B2B.
          </p>

          <div className="cta__actions">
            <a href="/register" className="cta__btn cta__btn--primary">
              Crear Cuenta Gratis
            </a>
            <a href="/login" className="cta__btn cta__btn--secondary">
              Ya tengo cuenta
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

export default HomeClientePage;
