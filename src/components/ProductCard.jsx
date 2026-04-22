import './ProductCard.css';

function ProductCard({ product, onAddToCart }) {
  if (!product) {
    return <div className="product-card">Producto no disponible.</div>;
  }

  const safePrice = Number(product.price || 0);

  return (
    <div className="product-card">
      <div className="product-card__image-container">
        <img
          src={product.image || 'https://via.placeholder.com/300x200?text=Producto'}
          alt={product.name || 'Producto'}
          className="product-card__image"
        />
        <span className="product-card__category">
          {product.category || 'Sin categoría'}
        </span>
      </div>

      <div className="product-card__info">
        <h3 className="product-card__name">{product.name || 'Sin nombre'}</h3>
        <p className="product-card__producer">
          {product.producer || 'Productor desconocido'}
        </p>
        <p className="product-card__description">
          {product.description || 'Sin descripción'}
        </p>

        <div className="product-card__footer">
          <span className="product-card__price">
            ${safePrice.toFixed(2)}
          </span>

          <button
            className="product-card__add-btn"
            onClick={() => onAddToCart && onAddToCart(product)}
          >
            + Agregar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;