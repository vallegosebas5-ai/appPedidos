import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  getProducts, createProduct, updateProduct,
  deleteProduct, toggleProductAvailability, COIN_COST_PER_PRODUCT
} from '../../services/products'
import { deductCoins } from '../../services/coins'
import { useAuth } from '../../context/AuthContext'
import DashboardLayout from '../../components/layout/DashboardLayout'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, Eye, EyeOff, Package, Coins, X, ImageIcon } from 'lucide-react'

const CATEGORIES = ['Comida', 'Bebidas', 'Postres', 'Snacks', 'Otros']

function ProductModal({ product, onClose, onSave, userCoins }) {
  const [imagePreview, setImagePreview] = useState(product?.imageUrl || null)
  const [imageFile, setImageFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: product || {},
  })

  function handleImageChange(e) {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  async function onSubmit(data) {
    setSaving(true)
    try {
      await onSave(data, imageFile)
      onClose()
    } catch (err) {
      toast.error(err.message || 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="font-bold text-gray-800 text-lg">
            {product ? 'Editar producto' : 'Nuevo producto'}
          </h3>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition">
            <X size={18} />
          </button>
        </div>

        {!product && (
          <div className="mx-6 mt-4 px-4 py-3 bg-orange-50 rounded-xl flex items-center gap-2">
            <Coins size={16} className="text-orange-500" />
            <p className="text-sm text-orange-700">
              Publicar este producto costará <strong>{COIN_COST_PER_PRODUCT} moneda</strong>.
              Tienes <strong>{userCoins}</strong> monedas.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* Imagen */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Imagen del producto</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden bg-gray-50">
                {imagePreview
                  ? <img src={imagePreview} alt="" className="w-full h-full object-cover" />
                  : <ImageIcon size={24} className="text-gray-300" />
                }
              </div>
              <label className="cursor-pointer px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-medium rounded-xl transition">
                Seleccionar imagen
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del producto</label>
            <input
              placeholder="Ej: Hamburguesa clásica"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
              {...register('name', { required: 'Requerido' })}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              rows={3}
              placeholder="Describe tu producto..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm resize-none"
              {...register('description')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio (Bs)</label>
              <input
                type="number" min="0.1" step="0.1"
                placeholder="0.00"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
                {...register('price', { required: 'Requerido', min: 0.1 })}
              />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <select
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
                {...register('category', { required: 'Requerido' })}
              >
                <option value="">Seleccionar...</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition disabled:opacity-50 text-sm"
            >
              {saving ? 'Guardando...' : product ? 'Guardar cambios' : 'Publicar producto'}
            </button>
            <button type="button" onClick={onClose} className="px-5 py-3 bg-gray-100 text-gray-600 rounded-xl text-sm hover:bg-gray-200 transition">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function SellerProducts() {
  const { currentUser, userProfile, fetchUserProfile } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null) // null | 'new' | product object

  async function load() {
    if (!currentUser) return
    try {
      const data = await getProducts({ sellerId: currentUser.uid })
      setProducts(data)
    } catch (err) {
      console.error('Error cargando productos:', err)
      toast.error('Error al cargar productos: ' + (err.message || err.code || 'Verifica tu conexión'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [currentUser])

  async function handleCreate(data, imageFile) {
    if ((userProfile?.coins ?? 0) < COIN_COST_PER_PRODUCT) {
      throw new Error('No tienes suficientes monedas. Compra más en la sección de Monedas.')
    }
    await createProduct(data, imageFile, currentUser.uid, userProfile.name)
    await deductCoins(currentUser.uid, COIN_COST_PER_PRODUCT, `Publicar: ${data.name}`)
    await fetchUserProfile(currentUser.uid)
    toast.success('Producto publicado')
    await load()
  }

  async function handleUpdate(product, data, imageFile) {
    await updateProduct(product.id, data, imageFile)
    toast.success('Producto actualizado')
    await load()
  }

  async function handleDelete(id) {
    if (!confirm('¿Eliminar este producto?')) return
    await deleteProduct(id)
    toast.success('Producto eliminado')
    setProducts((p) => p.filter((x) => x.id !== id))
  }

  async function handleToggle(product) {
    await toggleProductAvailability(product.id, !product.available)
    toast.success(product.available ? 'Producto pausado' : 'Producto activado')
    setProducts((p) => p.map((x) => x.id === product.id ? { ...x, available: !x.available } : x))
  }

  return (
    <DashboardLayout>
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Mis Productos</h2>
            <div className="flex items-center gap-2">
              <Coins size={14} className="text-orange-400" />
              <span className="text-sm text-gray-500">
                Tienes <strong className="text-orange-500">{userProfile?.coins ?? 0} monedas</strong> disponibles
              </span>
            </div>
          </div>
          <button
            onClick={() => setModal('new')}
            disabled={(userProfile?.coins ?? 0) < COIN_COST_PER_PRODUCT}
            className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={18} />
            Nuevo producto
          </button>
        </div>

        {(userProfile?.coins ?? 0) < COIN_COST_PER_PRODUCT && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 mb-6 flex items-center gap-3">
            <Coins size={16} className="text-orange-500" />
            <p className="text-sm text-orange-700">
              Necesitas al menos <strong>1 moneda</strong> para publicar un producto.{' '}
              <a href="/seller/coins" className="underline font-medium">Comprar monedas</a>
            </p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-400">Cargando...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Package size={48} className="mx-auto mb-3 opacity-20" />
            <p className="font-medium text-gray-500">No tienes productos publicados</p>
            <p className="text-sm mt-1">Haz clic en "Nuevo producto" para comenzar</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {products.map((p) => (
              <div key={p.id} className={`bg-white rounded-2xl shadow-sm overflow-hidden ${!p.available ? 'opacity-60' : ''}`}>
                <div className="h-40 bg-gray-100 relative overflow-hidden">
                  {p.imageUrl
                    ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center"><Package size={40} className="text-gray-300" /></div>
                  }
                  <span className={`absolute top-2 right-2 px-2 py-0.5 text-xs font-semibold rounded-full ${p.available ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                    {p.available ? 'Activo' : 'Pausado'}
                  </span>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-semibold text-gray-800">{p.name}</h4>
                    <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full shrink-0">{p.category}</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-2 line-clamp-2">{p.description}</p>
                  <p className="text-lg font-bold text-gray-800">Bs {Number(p.price).toFixed(2)}</p>
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => setModal(p)} className="flex-1 flex items-center justify-center gap-1 py-2 text-xs font-medium bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition">
                      <Pencil size={13} /> Editar
                    </button>
                    <button onClick={() => handleToggle(p)} className="flex-1 flex items-center justify-center gap-1 py-2 text-xs font-medium bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition">
                      {p.available ? <><EyeOff size={13} /> Pausar</> : <><Eye size={13} /> Activar</>}
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="p-2 text-red-400 bg-red-50 rounded-xl hover:bg-red-100 transition">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modal && (
        <ProductModal
          product={modal === 'new' ? null : modal}
          userCoins={userProfile?.coins ?? 0}
          onClose={() => setModal(null)}
          onSave={modal === 'new'
            ? (data, file) => handleCreate(data, file)
            : (data, file) => handleUpdate(modal, data, file)
          }
        />
      )}
    </DashboardLayout>
  )
}
