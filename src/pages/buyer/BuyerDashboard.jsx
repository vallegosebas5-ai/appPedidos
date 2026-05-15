import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProducts } from '../../services/products'
import { getBuyerOrders } from '../../services/orders'
import { useAuth } from '../../context/AuthContext'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { Search, ShoppingCart, ChevronRight, Package, Store, Star, ArrowRight } from 'lucide-react'

const CATEGORIES = [
  { label: 'Todos',   emoji: '🍽️' },
  { label: 'Comida',  emoji: '🍔' },
  { label: 'Bebidas', emoji: '🧃' },
  { label: 'Postres', emoji: '🍰' },
  { label: 'Snacks',  emoji: '🍿' },
  { label: 'Otros',   emoji: '📦' },
]

const GREET = () => {
  const h = new Date().getHours()
  if (h < 12) return '¡Buenos días'
  if (h < 18) return '¡Buenas tardes'
  return '¡Buenas noches'
}

const STATUS_MAP = {
  pending:    { label: 'Pendiente',  color: 'bg-yellow-100 text-yellow-700' },
  processing: { label: 'En camino',  color: 'bg-blue-100 text-blue-700' },
  delivered:  { label: 'Entregado',  color: 'bg-green-100 text-green-700' },
  cancelled:  { label: 'Cancelado',  color: 'bg-red-100 text-red-700' },
}

function StatusBadge({ status }) {
  const s = STATUS_MAP[status] || STATUS_MAP.pending
  return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${s.color}`}>{s.label}</span>
}

export default function BuyerDashboard() {
  const { currentUser, userProfile } = useAuth()
  const [products, setProducts] = useState([])
  const [recentOrders, setRecentOrders] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Todos')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [prods, orders] = await Promise.all([
          getProducts(),
          getBuyerOrders(currentUser.uid),
        ])
        setProducts(prods.filter((p) => p.available))
        setRecentOrders(orders.slice(0, 3))
      } catch (err) {
        console.error('Error cargando dashboard:', err)
      } finally {
        setLoading(false)
      }
    }
    if (currentUser) load()
  }, [currentUser])

  const cart = JSON.parse(localStorage.getItem('cart') || '[]')
  const cartCount = cart.reduce((s, i) => s + i.qty, 0)

  const filtered = products.filter((p) => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === 'Todos' || p.category === category
    return matchSearch && matchCat
  })

  function addToCart(product) {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const idx = cart.findIndex((i) => i.id === product.id)
    if (idx >= 0) cart[idx].qty += 1
    else cart.push({ ...product, qty: 1 })
    localStorage.setItem('cart', JSON.stringify(cart))
    window.dispatchEvent(new Event('storage'))
  }

  const firstName = userProfile?.name?.split(' ')[0]

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">

        {/* Greeting banner */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-400 rounded-3xl p-6 mb-6 flex items-center justify-between overflow-hidden relative shadow-lg shadow-orange-200">
          <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full" />
          <div className="absolute right-20 -bottom-6 w-24 h-24 bg-white/10 rounded-full" />
          <div className="relative z-10">
            <p className="text-orange-100 text-sm font-medium mb-1">{GREET()}</p>
            <h2 className="text-2xl font-black text-white mb-1">{firstName}! 👋</h2>
            <p className="text-orange-100 text-sm">¿Qué quieres pedir hoy?</p>
          </div>
          <Link to="/buyer/cart" className="relative z-10 bg-white/20 hover:bg-white/30 transition p-3 rounded-2xl">
            <ShoppingCart size={24} className="text-white" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-black rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-white rounded-2xl border border-orange-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition text-sm"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-6 scrollbar-hide">
          {CATEGORIES.map(({ label, emoji }) => (
            <button
              key={label}
              onClick={() => setCategory(label)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all ${
                category === label
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                  : 'bg-white text-gray-500 hover:bg-orange-50 hover:text-orange-600 shadow-sm border border-orange-50'
              }`}
            >
              <span>{emoji}</span> {label}
            </button>
          ))}
        </div>

        {/* Banner promo */}
        {!search && category === 'Todos' && (
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-3xl p-6 mb-6 flex items-center justify-between overflow-hidden relative shadow-md">
            <div className="absolute -right-6 -top-6 text-8xl opacity-20">🍔</div>
            <div className="absolute right-16 -bottom-4 text-6xl opacity-20">🍕</div>
            <div className="relative z-10">
              <p className="text-blue-100 text-sm font-medium mb-1">Explora el catálogo</p>
              <h3 className="text-white font-black text-xl mb-3">Los mejores productos<br />al mejor precio</h3>
              <Link
                to="/buyer/catalog"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-blue-600 text-sm font-bold rounded-xl hover:bg-blue-50 transition"
              >
                Ver todo <ArrowRight size={15} />
              </Link>
            </div>
            <div className="text-6xl shrink-0 relative z-10">🛒</div>
          </div>
        )}

        {/* Products */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-gray-800 text-lg">
              {search ? `Resultados para "${search}"` : category === 'Todos' ? 'Productos destacados' : category}
            </h3>
            <Link to="/buyer/catalog" className="text-sm text-orange-500 font-semibold flex items-center gap-0.5 hover:gap-1.5 transition-all">
              Ver todos <ChevronRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                  <div className="h-32 bg-orange-50" />
                  <div className="p-3 space-y-2">
                    <div className="h-3 bg-orange-50 rounded w-3/4" />
                    <div className="h-3 bg-orange-50 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-orange-50">
              <Package size={40} className="mx-auto mb-3 text-orange-200" />
              <p className="text-gray-400 font-medium">No hay productos disponibles</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filtered.slice(0, 6).map((p) => (
                <div key={p.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition group border border-orange-50">
                  <div className="h-32 bg-orange-50 overflow-hidden relative">
                    {p.imageUrl
                      ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      : <div className="w-full h-full flex items-center justify-center text-4xl">
                          {CATEGORIES.find((c) => c.label === p.category)?.emoji || '📦'}
                        </div>
                    }
                    <span className="absolute top-2 left-2 text-xs bg-white/90 px-2 py-0.5 rounded-full font-semibold text-gray-600 shadow-sm">
                      {p.category}
                    </span>
                  </div>
                  <div className="p-3">
                    <p className="font-bold text-gray-800 text-sm truncate">{p.name}</p>
                    <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                      <Store size={10} /> {p.sellerName}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="font-black text-orange-500 text-base">Bs {Number(p.price).toFixed(0)}</p>
                      <button
                        onClick={() => addToCart(p)}
                        className="w-7 h-7 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white rounded-lg flex items-center justify-center transition-all"
                      >
                        <span className="text-lg font-bold leading-none">+</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent orders */}
        {recentOrders.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-gray-800 text-lg">Mis pedidos recientes</h3>
              <Link to="/buyer/orders" className="text-sm text-orange-500 font-semibold flex items-center gap-0.5 hover:gap-1.5 transition-all">
                Ver todos <ChevronRight size={14} />
              </Link>
            </div>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <Link key={order.id} to="/buyer/orders" className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition border border-orange-50 group">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
                    <Package size={18} className="text-orange-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 text-sm">Pedido #{order.id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-xs text-gray-400">{order.items?.length} producto{order.items?.length !== 1 ? 's' : ''} · Bs {Number(order.total).toFixed(2)}</p>
                  </div>
                  <StatusBadge status={order.status} />
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  )
}
