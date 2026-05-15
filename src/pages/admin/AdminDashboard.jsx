import { useEffect, useState } from 'react'
import { apiFetch } from '../../services/api'
import { getAllOrders } from '../../services/orders'
import { useAuth } from '../../context/AuthContext'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { Users, Store, ShoppingCart, Coins, ArrowRight, Settings } from 'lucide-react'
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

export default function AdminDashboard() {
  const { userProfile } = useAuth()
  const [stats, setStats] = useState({ buyers: 0, sellers: 0, orders: 0 })

  useEffect(() => {
    async function load() {
      const [users, orders] = await Promise.all([
        apiFetch('/users/list.php'),
        getAllOrders(),
      ])
      setStats({
        buyers:  users.filter((u) => u.role === 'comprador').length,
        sellers: users.filter((u) => u.role === 'vendedor').length,
        orders:  orders.length,
      })
    }
    load()
  }, [])

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">

        <div className="bg-gradient-to-r from-purple-600 to-purple-500 rounded-3xl p-6 mb-6 flex items-center justify-between overflow-hidden relative shadow-lg shadow-purple-200">
          <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full" />
          <div className="absolute right-20 -bottom-6 w-24 h-24 bg-white/10 rounded-full" />
          <div className="relative z-10">
            <p className="text-purple-100 text-sm font-medium mb-1">Panel de control</p>
            <h2 className="text-2xl font-black text-white mb-1">Hola, {userProfile?.name?.split(' ')[0]}! ⚙️</h2>
            <p className="text-purple-100 text-sm">Resumen general de la plataforma</p>
          </div>
          <div className="text-6xl relative z-10 hidden sm:block">🛡️</div>
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          <StatCard icon={Users}        label="Compradores"      value={stats.buyers}  gradient="bg-gradient-to-br from-blue-500 to-blue-600"   to="/admin/users" />
          <StatCard icon={Store}        label="Vendedores"       value={stats.sellers} gradient="bg-gradient-to-br from-green-500 to-green-600"  to="/admin/users" />
          <StatCard icon={ShoppingCart} label="Pedidos totales"  value={stats.orders}  gradient="bg-gradient-to-br from-orange-500 to-orange-600" to="/admin/orders" />
          <StatCard icon={Coins}        label="Monedas vendidas" value="—"             gradient="bg-gradient-to-br from-purple-500 to-purple-600" to="/admin/coins" />
        </div>

        <div className="bg-white/70 backdrop-blur rounded-2xl p-5 shadow-sm border border-orange-50">
          <h3 className="font-black text-gray-800 mb-4 text-base">Acciones rápidas</h3>
          <div className="space-y-3">
            <QuickAction icon={Users}        label="Gestionar usuarios"    desc="Ver y administrar compradores y vendedores" to="/admin/users"    color="bg-blue-500" />
            <QuickAction icon={Coins}        label="Gestionar monedas"     desc="Crear y editar paquetes de monedas"         to="/admin/coins"    color="bg-purple-500" />
            <QuickAction icon={ShoppingCart} label="Ver todos los pedidos" desc="Supervisa el estado de todos los pedidos"   to="/admin/orders"   color="bg-orange-500" />
            <QuickAction icon={Settings}     label="Configuración de pagos" desc="Sube el QR estático para recibir pagos"   to="/admin/settings" color="bg-gray-500" />
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}
