import { useEffect, useState } from 'react'
import { getProducts } from '../../services/products'
import { getSellerOrders } from '../../services/orders'
import { useAuth } from '../../context/AuthContext'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { Package, ClipboardList, Coins, TrendingUp, ArrowRight, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'

function StatCard({ icon: Icon, label, value, gradient, to }) {
  return (
    <Link to={to} className={`rounded-2xl p-5 flex items-center gap-4 hover:scale-[1.02] transition-all shadow-sm ${gradient}`}>
      <div className="w-12 h-12 rounded-xl bg-white/25 flex items-center justify-center shrink-0">
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-sm text-white/80 font-medium">{label}</p>
        <p className="text-3xl font-black text-white">{value}</p>
      </div>
    </Link>
  )
}

function QuickAction({ icon: Icon, label, desc, to, color }) {
  return (
    <Link to={to} className="bg-white rounded-2xl p-5 flex items-center gap-4 hover:shadow-md hover:scale-[1.01] transition-all shadow-sm group border border-orange-50">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      <div className="flex-1">
        <p className="font-bold text-gray-800 text-sm">{label}</p>
        <p className="text-xs text-gray-400">{desc}</p>
      </div>
      <ArrowRight size={16} className="text-gray-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
    </Link>
  )
}

export default function SellerDashboard() {
  const { userProfile } = useAuth()
  const [stats, setStats] = useState({ products: 0, orders: 0 })

  useEffect(() => {
    if (!userProfile) return
    async function load() {
      const [prods, ords] = await Promise.all([
        getProducts({ sellerId: userProfile.uid }),
        getSellerOrders(userProfile.uid),
      ])
      setStats({ products: prods.length, orders: ords.length })
    }
    load()
  }, [userProfile])

  const firstName = userProfile?.name?.split(' ')[0]

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">

        {/* Greeting banner */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-400 rounded-3xl p-6 mb-6 flex items-center justify-between overflow-hidden relative shadow-lg shadow-orange-200">
          <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full" />
          <div className="absolute right-20 -bottom-6 w-24 h-24 bg-white/10 rounded-full" />
          <div className="relative z-10">
            <p className="text-orange-100 text-sm font-medium mb-1">Bienvenido de vuelta</p>
            <h2 className="text-2xl font-black text-white mb-1">Hola, {firstName}! 👋</h2>
            <p className="text-orange-100 text-sm">Aquí está el resumen de tu tienda</p>
          </div>
          <div className="text-6xl relative z-10 hidden sm:block">🏪</div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          <StatCard icon={Package}       label="Mis productos"     value={stats.products}           gradient="bg-gradient-to-br from-blue-500 to-blue-600"   to="/seller/products" />
          <StatCard icon={ClipboardList} label="Pedidos recibidos" value={stats.orders}             gradient="bg-gradient-to-br from-green-500 to-green-600"  to="/seller/orders" />
          <StatCard icon={Coins}         label="Mis monedas"       value={userProfile?.coins ?? 0}  gradient="bg-gradient-to-br from-orange-500 to-orange-600" to="/seller/coins" />
          <StatCard icon={TrendingUp}    label="Ventas del mes"    value="—"                        gradient="bg-gradient-to-br from-purple-500 to-purple-600" to="/seller/orders" />
        </div>

        {/* Alerta monedas */}
        {(userProfile?.coins ?? 0) === 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 mb-6 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
              <Coins size={20} className="text-orange-500" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-orange-800">Necesitas monedas para publicar</p>
              <p className="text-sm text-orange-600 mt-0.5">Compra monedas para publicar tus productos en el catálogo.</p>
            </div>
            <Link to="/seller/coins" className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-xl transition shrink-0">
              Comprar
            </Link>
          </div>
        )}

        {/* Acciones rápidas */}
        <div className="bg-white/70 backdrop-blur rounded-2xl p-5 shadow-sm border border-orange-50">
          <h3 className="font-black text-gray-800 mb-4 text-base">Acciones rápidas</h3>
          <div className="space-y-3">
            <QuickAction icon={Plus}          label="Agregar producto"  desc="Publica un nuevo producto en el catálogo" to="/seller/products" color="bg-blue-500" />
            <QuickAction icon={ClipboardList} label="Ver pedidos"        desc="Revisa y gestiona tus pedidos"            to="/seller/orders"   color="bg-green-500" />
            <QuickAction icon={Coins}         label="Comprar monedas"   desc="Recarga tu saldo de monedas"              to="/seller/coins"    color="bg-orange-500" />
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}
