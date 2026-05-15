import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import {
  LayoutDashboard, ShoppingCart, Store, Users,
  Coins, Package, ClipboardList, LogOut, Menu, X, Pencil
} from 'lucide-react'
import { useState } from 'react'

const NAV = {
  admin: [
    { to: '/admin',          icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/users',    icon: Users,            label: 'Usuarios' },
    { to: '/admin/coins',    icon: Coins,            label: 'Monedas' },
    { to: '/admin/orders',   icon: ClipboardList,    label: 'Pedidos' },
    { to: '/admin/settings', icon: Pencil,           label: 'Configuración' },
  ],
  vendedor: [
    { to: '/seller',          icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/seller/products', icon: Package,          label: 'Productos' },
    { to: '/seller/orders',   icon: ClipboardList,    label: 'Mis Pedidos' },
    { to: '/seller/coins',    icon: Coins,            label: 'Monedas' },
  ],
  comprador: [
    { to: '/buyer',         icon: LayoutDashboard, label: 'Inicio' },
    { to: '/buyer/catalog', icon: Store,            label: 'Catálogo' },
    { to: '/buyer/cart',    icon: ShoppingCart,     label: 'Carrito' },
    { to: '/buyer/orders',  icon: ClipboardList,    label: 'Mis Pedidos' },
  ],
}

const roleLabel = {
  admin:     'Administrador',
  vendedor:  'Vendedor',
  comprador: 'Comprador',
}

const roleBadgeColor = {
  admin:     'bg-purple-100 text-purple-600',
  vendedor:  'bg-orange-100 text-orange-600',
  comprador: 'bg-blue-100 text-blue-600',
}

export default function Sidebar() {
  const { userProfile, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const items = NAV[userProfile?.role] || []

  async function handleLogout() {
    await logout()
    toast.success('Sesión cerrada')
    navigate('/login')
  }

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden bg-white p-2 rounded-xl shadow-md"
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-80 bg-white border-r border-orange-100 shadow-xl z-40 flex flex-col
        transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:flex
      `}>
        {/* Logo */}
        <div className="p-5 border-b border-orange-100">
          <Link to="/dashboard" onClick={() => setOpen(false)}>
            <img src="/wechi1.png" alt="Wechi" className="h-10 w-auto" />
          </Link>
        </div>

        {/* User info */}
        <div className="px-4 py-4 border-b border-orange-100">
          <div className="flex items-center gap-3 mb-3">
            {userProfile?.photo ? (
              <img
                src={userProfile.photo}
                alt={userProfile.name}
                className="w-10 h-10 rounded-xl object-cover shadow-sm"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-sm shadow-orange-200">
                <span className="text-white font-black text-base">
                  {userProfile?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="overflow-hidden flex-1">
              <p className="text-sm font-bold text-gray-800 truncate">{userProfile?.name}</p>
              <p className="text-xs text-gray-400 truncate">{userProfile?.email}</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${roleBadgeColor[userProfile?.role]}`}>
              {roleLabel[userProfile?.role]}
            </span>
            <Link
              to="/profile/edit"
              onClick={() => setOpen(false)}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-orange-500 transition"
            >
              <Pencil size={12} />
              Editar perfil
            </Link>
          </div>
          {userProfile?.role === 'vendedor' && (
            <div className="mt-3 flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-xl px-3 py-2">
              <Coins size={15} className="text-orange-500 shrink-0" />
              <span className="text-sm font-bold text-orange-600">
                {userProfile?.coins ?? 0} monedas
              </span>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {items.map(({ to, icon: Icon, label }) => {
            const active = location.pathname === to
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                    : 'text-gray-500 hover:bg-orange-50 hover:text-orange-600'
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-orange-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-semibold text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all"
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  )
}
