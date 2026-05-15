import { useEffect, useState } from 'react'
import { apiFetch } from '../../services/api'
import DashboardLayout from '../../components/layout/DashboardLayout'
import toast from 'react-hot-toast'
import { Users, Coins, Shield, Store, ShoppingCart } from 'lucide-react'

const ROLE_CONFIG = {
  admin:     { label: 'Admin',     icon: Shield,       color: 'bg-purple-100 text-purple-700' },
  vendedor:  { label: 'Vendedor',  icon: Store,        color: 'bg-blue-100 text-blue-700' },
  comprador: { label: 'Comprador', icon: ShoppingCart, color: 'bg-green-100 text-green-700' },
}

export default function AdminUsers() {
  const [users, setUsers]   = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')

  async function loadUsers() {
    const data = await apiFetch('/users/list.php')
    setUsers(data)
    setLoading(false)
  }

  useEffect(() => { loadUsers() }, [])

  async function changeRole(uid, newRole) {
    await apiFetch('/users/role.php', {
      method: 'PUT',
      body: JSON.stringify({ uid, role: newRole }),
    })
    toast.success('Rol actualizado')
    setUsers((prev) => prev.map((u) => u.uid === uid ? { ...u, role: newRole } : u))
  }

  async function addCoins(uid, amount) {
    const res = await apiFetch('/users/coins.php', {
      method: 'POST',
      body: JSON.stringify({ uid, amount }),
    })
    toast.success(`+${amount} monedas asignadas`)
    setUsers((prev) => prev.map((u) => u.uid === uid ? { ...u, coins: res.coins } : u))
  }

  const filtered = users.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <DashboardLayout>
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Gestión de Usuarios</h2>
        <p className="text-gray-500 mb-6">Administra roles y monedas de los usuarios</p>

        <input
          type="text"
          placeholder="Buscar por nombre o correo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2.5 rounded-xl border border-gray-200 mb-6 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />

        {loading ? (
          <div className="text-center py-12 text-gray-400">Cargando usuarios...</div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Usuario</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Rol</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Monedas</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((user) => {
                  const role = ROLE_CONFIG[user.role] || ROLE_CONFIG.comprador
                  return (
                    <tr key={user.uid} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center">
                            <span className="text-orange-600 font-semibold text-sm">
                              {user.name?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-800 text-sm">{user.name}</p>
                            <p className="text-xs text-gray-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={user.role}
                          onChange={(e) => changeRole(user.uid, e.target.value)}
                          className={`text-xs font-semibold px-3 py-1.5 rounded-lg border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-400 ${role.color}`}
                        >
                          <option value="comprador">Comprador</option>
                          <option value="vendedor">Vendedor</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <Coins size={14} className="text-orange-400" />
                          <span className="font-semibold text-gray-700">{user.coins ?? 0}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button onClick={() => addCoins(user.uid, 10)}  className="px-3 py-1.5 text-xs font-medium bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition">+10 monedas</button>
                          <button onClick={() => addCoins(user.uid, 50)}  className="px-3 py-1.5 text-xs font-medium bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition">+50 monedas</button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-10 text-gray-400">
                <Users size={32} className="mx-auto mb-2 opacity-30" />
                No se encontraron usuarios
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
