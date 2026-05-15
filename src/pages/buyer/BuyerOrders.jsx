import { useEffect, useState } from 'react'
import { getBuyerOrders, ORDER_STATUS } from '../../services/orders'
import { useAuth } from '../../context/AuthContext'
import DashboardLayout from '../../components/layout/DashboardLayout'
import OrderChat from '../../components/ui/OrderChat'
import { ShoppingBag, QrCode, CreditCard, Package, MessageCircle } from 'lucide-react'

function PayIcon({ method }) {
  return method === 'qr'
    ? <QrCode size={14} className="text-orange-400" />
    : <CreditCard size={14} className="text-blue-400" />
}

export default function BuyerOrders() {
  const { currentUser, userProfile } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [openChat, setOpenChat] = useState(null)

  useEffect(() => {
    if (!currentUser) return
    getBuyerOrders(currentUser.uid).then((data) => {
      setOrders(data)
      setLoading(false)
    })
  }, [currentUser])

  function formatDate(ts) {
    if (!ts) return '—'
    const d = ts.toDate ? ts.toDate() : new Date(ts)
    return d.toLocaleDateString('es-BO', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  function toggleChat(orderId) {
    setOpenChat(prev => prev === orderId ? null : orderId)
  }

  return (
    <DashboardLayout>
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Mis Pedidos</h2>
        <p className="text-gray-500 mb-6">Historial de todas tus compras</p>

        {loading ? (
          <div className="text-center py-16 text-gray-400">Cargando pedidos...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShoppingBag size={36} className="text-gray-300" />
            </div>
            <p className="font-semibold text-gray-500 mb-1">Aún no tienes pedidos</p>
            <p className="text-sm text-gray-400">Tus pedidos aparecerán aquí una vez que compres</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const status = ORDER_STATUS[order.status] || ORDER_STATUS.pending
              const chatOpen = openChat === order.id
              return (
                <div key={order.id} className="bg-white rounded-2xl shadow-sm p-5">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <p className="font-semibold text-gray-800">Pedido #{order.id.slice(0, 8).toUpperCase()}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{formatDate(order.createdAt)}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Vendedor: <strong>{order.sellerName}</strong></p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    {order.items?.map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                          {item.imageUrl
                            ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center"><Package size={16} className="text-gray-300" /></div>
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-700 truncate">{item.name}</p>
                          <p className="text-xs text-gray-400">x{item.qty}</p>
                        </div>
                        <p className="text-sm font-semibold text-gray-700 shrink-0">
                          Bs {(Number(item.price) * item.qty).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <PayIcon method={order.paymentMethod} />
                      {order.paymentMethod === 'qr' ? 'Pago por QR' : 'Pago con tarjeta'}
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="font-bold text-gray-800">
                        Total: <span className="text-orange-500">Bs {Number(order.total).toFixed(2)}</span>
                      </p>
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
                    </div>
                  </div>

                  {chatOpen && (
                    <OrderChat
                      orderId={order.id}
                      senderId={currentUser.uid}
                      senderName={userProfile?.name || 'Comprador'}
                      senderRole="comprador"
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
