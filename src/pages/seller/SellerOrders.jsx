import { useEffect, useState } from 'react'
import { subscribeSellerOrders, updateOrderStatus, ORDER_STATUS } from '../../services/orders'
import { useAuth } from '../../context/AuthContext'
import DashboardLayout from '../../components/layout/DashboardLayout'
import OrderChat from '../../components/ui/OrderChat'
import toast from 'react-hot-toast'
import { ClipboardList, QrCode, CreditCard, Package, MessageCircle } from 'lucide-react'

const STATUS_FLOW = {
  pending:    ['processing', 'cancelled'],
  processing: ['delivered'],
  delivered:  [],
  cancelled:  [],
}

export default function SellerOrders() {
  const { currentUser, userProfile } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [openChat, setOpenChat] = useState(null)

  useEffect(() => {
    if (!currentUser) return
    const unsub = subscribeSellerOrders(currentUser.uid, (data) => {
      setOrders(data)
      setLoading(false)
    })
    return unsub
  }, [currentUser])

  async function handleStatus(orderId, newStatus) {
    await updateOrderStatus(orderId, newStatus)
    toast.success(`Pedido marcado como "${ORDER_STATUS[newStatus]?.label}"`)
  }

  function formatDate(ts) {
    if (!ts) return '—'
    const d = ts.toDate ? ts.toDate() : new Date(ts)
    return d.toLocaleDateString('es-BO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
  }

  function toggleChat(orderId) {
    setOpenChat(prev => prev === orderId ? null : orderId)
  }

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter)

  const counts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1
    return acc
  }, {})

  return (
    <DashboardLayout>
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-gray-800">Pedidos Recibidos</h2>
          <span className="text-xs text-green-500 font-medium bg-green-50 px-3 py-1 rounded-full">
            En tiempo real
          </span>
        </div>
        <p className="text-gray-500 mb-6">Los pedidos se actualizan automáticamente</p>

        {/* Filtros */}
        <div className="flex gap-2 flex-wrap mb-6">
          {[
            { key: 'all', label: 'Todos', count: orders.length },
            { key: 'pending', label: 'Pendientes', count: counts.pending || 0 },
            { key: 'processing', label: 'En proceso', count: counts.processing || 0 },
            { key: 'delivered', label: 'Entregados', count: counts.delivered || 0 },
            { key: 'cancelled', label: 'Cancelados', count: counts.cancelled || 0 },
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-1.5 ${
                filter === key ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 hover:bg-orange-50'
              }`}
            >
              {label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${filter === key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                {count}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400">Cargando pedidos...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ClipboardList size={36} className="text-gray-300" />
            </div>
            <p className="font-semibold text-gray-500">No hay pedidos {filter !== 'all' ? `"${ORDER_STATUS[filter]?.label?.toLowerCase()}"` : ''}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((order) => {
              const status = ORDER_STATUS[order.status] || ORDER_STATUS.pending
              const nextStatuses = STATUS_FLOW[order.status] || []
              const chatOpen = openChat === order.id
              return (
                <div key={order.id} className="bg-white rounded-2xl shadow-sm p-5">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <p className="font-semibold text-gray-800">
                        Pedido #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Cliente: <strong>{order.buyerName}</strong> · {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 ${status.color}`}>
                      {status.label}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    {order.items?.map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                          {item.imageUrl
                            ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center"><Package size={14} className="text-gray-300" /></div>
                          }
                        </div>
                        <p className="flex-1 text-sm text-gray-700">{item.name} <span className="text-gray-400">x{item.qty}</span></p>
                        <p className="text-sm font-semibold">Bs {(Number(item.price) * item.qty).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 gap-3 flex-wrap">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      {order.paymentMethod === 'qr'
                        ? <><QrCode size={13} className="text-orange-400" /> QR</>
                        : <><CreditCard size={13} className="text-blue-400" /> Tarjeta</>
                      }
                      <span className="mx-1">·</span>
                      <span className="font-semibold text-gray-700">Bs {Number(order.total).toFixed(2)}</span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => toggleChat(order.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                          chatOpen
                            ? 'bg-orange-500 text-white'
                            : 'bg-orange-50 text-orange-500 hover:bg-orange-100'
                        }`}
                      >
                        <MessageCircle size={13} />
                        Chat
                      </button>

                      {nextStatuses.map((s) => (
                        <button
                          key={s}
                          onClick={() => handleStatus(order.id, s)}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition ${
                            s === 'cancelled'
                              ? 'bg-red-50 text-red-500 hover:bg-red-100'
                              : 'bg-orange-500 text-white hover:bg-orange-600'
                          }`}
                        >
                          {s === 'processing' ? 'Iniciar proceso' : s === 'delivered' ? 'Marcar entregado' : 'Cancelar'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {chatOpen && (
                    <OrderChat
                      orderId={order.id}
                      senderId={currentUser.uid}
                      senderName={userProfile?.name || 'Vendedor'}
                      senderRole="vendedor"
                    />
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
