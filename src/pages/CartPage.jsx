import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './CartPage.css';

function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();

  return (
    <main className="cart-page">
      <section className="cart-card">
        <h1>Carrito de Compras</h1>

        {cart.length === 0 ? (
          <p>Tu carrito está vacío por ahora...</p>
        ) : (
          <>
            <div className="cart-list">
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} className="cart-item__image" />

                  <div className="cart-item__info">
                    <h3>{item.name}</h3>
                    <p>{item.category}</p>
                    <p>${Number(item.price).toFixed(2)}</p>
                  </div>

                  <div className="cart-item__controls">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>

                  <button
                    className="cart-item__remove"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h2>Total: ${totalPrice.toFixed(2)}</h2>
              <Link to="/checkout" className="cart-summary__button">
                Continuar al checkout
              </Link>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

export default CartPage;
