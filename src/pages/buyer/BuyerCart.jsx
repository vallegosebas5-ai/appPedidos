import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { ShoppingCart, Trash2, Plus, Minus, Package, ArrowRight } from 'lucide-react'

export default function BuyerCart() {
  const [cart, setCart] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem('cart') || '[]'))
  }, [])

  function save(updated) {
    setCart(updated)
    localStorage.setItem('cart', JSON.stringify(updated))
  }

  function changeQty(id, delta) {
    const updated = cart.map((i) =>
      i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i
    )
    save(updated)
  }

  function remove(id) {
    save(cart.filter((i) => i.id !== id))
  }

  function clearCart() {
    save([])
  }

  const total = cart.reduce((s, i) => s + Number(i.price) * i.qty, 0)

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Mi Carrito</h2>
            <p className="text-gray-500 text-sm">{cart.length} producto{cart.length !== 1 ? 's' : ''}</p>
          </div>
          {cart.length > 0 && (
            <button onClick={clearCart} className="text-sm text-red-400 hover:text-red-500 transition">
              Vaciar carrito
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShoppingCart size={36} className="text-gray-300" />
            </div>
            <p className="font-semibold text-gray-500 mb-1">Tu carrito está vacío</p>
            <p className="text-sm text-gray-400 mb-6">Agrega productos desde el catálogo</p>
            <button
              onClick={() => navigate('/buyer/catalog')}
              className="px-6 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition"
            >
              Ver catálogo
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-6">
              {cart.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                    {item.imageUrl
                      ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center"><Package size={22} className="text-gray-300" /></div>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate">{item.name}</p>
                    <p className="text-xs text-gray-400">{item.sellerName}</p>
                    <p className="text-orange-500 font-bold mt-1">Bs {Number(item.price).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => changeQty(item.id, -1)}
                      className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="w-6 text-center font-semibold text-sm">{item.qty}</span>
                    <button
                      onClick={() => changeQty(item.id, 1)}
                      className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                  <p className="w-20 text-right font-bold text-gray-700 shrink-0">
                    Bs {(Number(item.price) * item.qty).toFixed(2)}
                  </p>
                  <button
                    onClick={() => remove(item.id)}
                    className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>

            {/* Resumen */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">Resumen del pedido</h3>
              <div className="space-y-2 mb-4">
                {cart.map((i) => (
                  <div key={i.id} className="flex justify-between text-sm text-gray-500">
                    <span>{i.name} x{i.qty}</span>
                    <span>Bs {(Number(i.price) * i.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-4 flex justify-between items-center mb-5">
                <span className="font-bold text-gray-800 text-lg">Total</span>
                <span className="font-bold text-orange-500 text-2xl">Bs {total.toFixed(2)}</span>
              </div>
              <button
                onClick={() => navigate('/buyer/checkout')}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition"
              >
                Ir al pago
                <ArrowRight size={18} />
              </button>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
