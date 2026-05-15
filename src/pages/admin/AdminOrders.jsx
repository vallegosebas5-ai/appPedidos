import { useEffect, useState } from 'react'
import { getAllOrders, updateOrderStatus, ORDER_STATUS } from '../../services/orders'
import DashboardLayout from '../../components/layout/DashboardLayout'
import toast from 'react-hot-toast'
import { ClipboardList, Package, QrCode, CreditCard } from 'lucide-react'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    getAllOrders().then((data) => { setOrders(data); setLoading(false) })
  }, [])

  async function handleStatus(orderId, newStatus) {
    await updateOrderStatus(orderId, newStatus)
    toast.success('Estado actualizado')
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: newStatus } : o))
  }

  function formatDate(ts) {
    if (!ts) return '—'
    const d = ts.toDate ? ts.toDate() : new Date(ts)
    return d.toLocaleDateString('es-BO', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((s, o) => s + Number(o.total), 0)

  const counts = orders.reduce((acc, o) => { acc[o.status] = (acc[o.status] || 0) + 1; return acc }, {})

  const filtered = orders.filter((o) => {
    const matchFilter = filter === 'all' || o.status === filter
    const matchSearch = !search || o.buyerName?.toLowerCase().includes(search.toLowerCase()) || o.sellerName?.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  return (
    <DashboardLayout>
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Todos los Pedidos</h2>
        <p className="text-gray-500 mb-6">Vista general de la plataforma</p>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total pedidos', value: orders.length, color: 'text-gray-800' },
            { label: 'Pendientes', value: counts.pending || 0, color: 'text-yellow-600' },
            { label: 'Entregados', value: counts.delivered || 0, color: 'text-green-600' },
            { label: 'Ingresos totales', value: `Bs ${totalRevenue.toFixed(2)}`, color: 'text-orange-500' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-2xl p-5 shadow-sm">
              <p className="text-xs text-gray-400 mb-1">{label}</p>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div className="flex gap-2 flex-wrap mb-4">
          {['all', 'pending', 'processing', 'delivered', 'cancelled'].map((key) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                filter === key ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 hover:bg-orange-50'
              }`}
            >
              {key === 'all' ? 'Todos' : ORDER_STATUS[key]?.label}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Buscar por comprador o vendedor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm px-4 py-2.5 rounded-xl border border-gray-200 mb-5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />

        {loading ? (
          <div className="text-center py-12 text-gray-400">Cargando pedidos...</div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase">Pedido</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase">Comprador</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase">Vendedor</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase">Pago</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase">Total</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase">Estado</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((order) => {
                  const status = ORDER_STATUS[order.status] || ORDER_STATUS.pending
                  return (
                    <tr key={order.id} className="hover:bg-gray-50 transition">
                      <td className="px-5 py-3.5">
                        <p className="font-mono font-semibold text-gray-700">#{order.id.slice(0, 8).toUpperCase()}</p>
                        <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
                      </td>
                      <td className="px-5 py-3.5 text-gray-700">{order.buyerName}</td>
                      <td className="px-5 py-3.5 text-gray-700">{order.sellerName}</td>
                      <td className="px-5 py-3.5">
                        {order.paymentMethod === 'qr'
                          ? <span className="flex items-center gap-1 text-orange-500"><QrCode size={13} /> QR</span>
                          : <span className="flex items-center gap-1 text-blue-500"><CreditCard size={13} /> Tarjeta</span>
                        }
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-gray-800">Bs {Number(order.total).toFixed(2)}</td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        {order.status === 'pending' && (
                          <button onClick={() => handleStatus(order.id, 'cancelled')} className="text-xs text-red-400 hover:text-red-600 transition">
                            Cancelar
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <ClipboardList size={36} className="mx-auto mb-2 opacity-20" />
                No hay pedidos
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
