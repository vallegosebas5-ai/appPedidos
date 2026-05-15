import { useEffect, useState } from 'react'
import { getProducts } from '../../services/products'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { Search, ShoppingCart, Package, Store } from 'lucide-react'
import toast from 'react-hot-toast'

const CATEGORIES = ['Todos', 'Comida', 'Bebidas', 'Postres', 'Snacks', 'Otros']

function ProductCard({ product, onAdd }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition">
      <div className="h-44 bg-gray-100 overflow-hidden">
        {product.imageUrl
          ? <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center"><Package size={40} className="text-gray-300" /></div>
        }
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h4 className="font-semibold text-gray-800 leading-tight">{product.name}</h4>
          <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full shrink-0">{product.category}</span>
        </div>
        <p className="text-xs text-gray-400 mb-1 line-clamp-2">{product.description}</p>
        <p className="text-xs text-gray-400 mb-3">
          <Store size={11} className="inline mr-1" />{product.sellerName}
        </p>
        <div className="flex items-center justify-between">
          <p className="text-lg font-bold text-gray-800">Bs {Number(product.price).toFixed(2)}</p>
          <button
            onClick={() => onAdd(product)}
            className="flex items-center gap-1.5 px-3 py-2 bg-orange-500 text-white text-xs font-semibold rounded-xl hover:bg-orange-600 transition"
          >
            <ShoppingCart size={14} />
            Agregar
          </button>
        </div>
      </div>
    </div>
  )
}

export default function BuyerCatalog() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Todos')

  useEffect(() => {
    async function load() {
      try {
        const data = await getProducts()
        setProducts(data.filter((p) => p.available))
      } catch (err) {
        console.error('Error cargando productos:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  function handleAdd(product) {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existing = cart.findIndex((i) => i.id === product.id)
    if (existing >= 0) {
      cart[existing].qty += 1
    } else {
      cart.push({ ...product, qty: 1 })
    }
    localStorage.setItem('cart', JSON.stringify(cart))
    toast.success(`${product.name} agregado al carrito`)
  }

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === 'Todos' || p.category === category
    return matchSearch && matchCat
  })

  return (
    <DashboardLayout>
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Catálogo</h2>
        <p className="text-gray-500 mb-6">Encuentra los mejores productos</p>

        {/* Search */}
        <div className="relative mb-4">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border border-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition ${
                category === cat
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-orange-50 hover:text-orange-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400">Cargando productos...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Package size={48} className="mx-auto mb-3 opacity-20" />
            <p className="font-medium">No hay productos disponibles</p>
            <p className="text-sm mt-1">Intenta con otra categoría o búsqueda</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-400 mb-4">{filtered.length} producto{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} onAdd={handleAdd} />
              ))}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
