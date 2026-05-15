import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { getCoinPackages, createCoinPackage, deleteCoinPackage } from '../../services/coins'
import DashboardLayout from '../../components/layout/DashboardLayout'
import toast from 'react-hot-toast'
import { Coins, Plus, Trash2, Package } from 'lucide-react'

export default function AdminCoins() {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  async function load() {
    setLoading(true)
    const data = await getCoinPackages()
    setPackages(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function onSubmit(data) {
    try {
      await createCoinPackage({
        name: data.name,
        coins: Number(data.coins),
        price: Number(data.price),
        popular: data.popular === 'true',
      })
      toast.success('Paquete creado')
      reset()
      setShowForm(false)
      load()
    } catch {
      toast.error('Error al crear paquete')
    }
  }

  async function handleDelete(id) {
    await deleteCoinPackage(id)
    toast.success('Paquete eliminado')
    setPackages((p) => p.filter((pkg) => pkg.id !== id))
  }

  return (
    <DashboardLayout>
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Paquetes de Monedas</h2>
            <p className="text-gray-500">Crea y gestiona los paquetes que los vendedores pueden comprar</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition"
          >
            <Plus size={18} />
            Nuevo paquete
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border-2 border-orange-100">
            <h3 className="font-semibold text-gray-800 mb-4">Crear nuevo paquete</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Nombre</label>
                <input
                  placeholder="Ej: Básico"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
                  {...register('name', { required: true })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Monedas</label>
                <input
                  type="number" min="1" placeholder="Ej: 10"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
                  {...register('coins', { required: true, min: 1 })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Precio (Bs)</label>
                <input
                  type="number" min="0.1" step="0.1" placeholder="Ej: 25"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
                  {...register('price', { required: true, min: 0.1 })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Destacado</label>
                <select
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
                  {...register('popular')}
                >
                  <option value="false">No</option>
                  <option value="true">Sí</option>
                </select>
              </div>
              <div className="sm:col-span-2 lg:col-span-4 flex gap-3">
                <button type="submit" className="px-5 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition">
                  Crear paquete
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-200 transition">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Packages grid */}
        {loading ? (
          <div className="text-center py-12 text-gray-400">Cargando...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`bg-white rounded-2xl p-6 shadow-sm relative ${pkg.popular ? 'ring-2 ring-orange-400' : ''}`}
              >
                {pkg.popular && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-orange-500 text-white text-xs font-semibold rounded-full">
                    Popular
                  </span>
                )}
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                  <Coins size={22} className="text-orange-500" />
                </div>
                <h3 className="font-bold text-gray-800 text-lg">{pkg.name}</h3>
                <p className="text-3xl font-bold text-orange-500 my-2">{pkg.coins}</p>
                <p className="text-sm text-gray-400 mb-1">monedas</p>
                <p className="text-lg font-semibold text-gray-700">Bs {pkg.price}</p>
                <button
                  onClick={() => handleDelete(pkg.id)}
                  className="mt-4 w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition"
                >
                  <Trash2 size={14} />
                  Eliminar
                </button>
              </div>
            ))}
            {packages.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-400">
                <Package size={40} className="mx-auto mb-3 opacity-30" />
                <p>No hay paquetes creados aún</p>
                <p className="text-sm">Haz clic en "Nuevo paquete" para comenzar</p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
