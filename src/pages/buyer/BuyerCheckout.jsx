import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { createOrder } from '../../services/orders'
import { getPaymentSettings } from '../../services/settings'
import { useAuth } from '../../context/AuthContext'
import DashboardLayout from '../../components/layout/DashboardLayout'
import toast from 'react-hot-toast'
import {
  QrCode, CreditCard, CheckCircle,
  ArrowLeft, ShoppingBag, Package
} from 'lucide-react'

const STEPS = { method: 1, pay: 2, confirm: 3 }

function CardForm({ onPay, loading }) {
  const { register, handleSubmit, formState: { errors } } = useForm()

  function formatCard(e) {
    let v = e.target.value.replace(/\D/g, '').slice(0, 16)
    e.target.value = v.replace(/(.{4})/g, '$1 ').trim()
  }

  function formatExpiry(e) {
    let v = e.target.value.replace(/\D/g, '').slice(0, 4)
    if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2)
    e.target.value = v
  }

  return (
    <form onSubmit={handleSubmit(onPay)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre en la tarjeta</label>
        <input
          placeholder="Juan Pérez"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
          {...register('cardName', { required: 'Requerido' })}
        />
        {errors.cardName && <p className="text-red-500 text-xs mt-1">{errors.cardName.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Número de tarjeta</label>
        <input
          placeholder="0000 0000 0000 0000"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm font-mono"
          onInput={formatCard}
          {...register('cardNumber', { required: 'Requerido', minLength: { value: 19, message: 'Número inválido' } })}
        />
        {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Vencimiento</label>
          <input
            placeholder="MM/AA"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm font-mono"
            onInput={formatExpiry}
            {...register('expiry', { required: 'Requerido', minLength: { value: 5, message: 'Inválido' } })}
          />
          {errors.expiry && <p className="text-red-500 text-xs mt-1">{errors.expiry.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
          <input
            placeholder="123"
            type="password"
            maxLength={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm font-mono"
            {...register('cvv', { required: 'Requerido', minLength: { value: 3, message: 'Inválido' } })}
          />
          {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv.message}</p>}
        </div>
      </div>
      <div className="bg-blue-50 rounded-xl px-4 py-3 text-xs text-blue-600">
        Pago simulado — no se realizará ningún cargo real
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition disabled:opacity-50"
      >
        {loading ? 'Procesando...' : 'Pagar con tarjeta'}
      </button>
    </form>
  )
}

function QRPayment({ total, onConfirm, loading, qrImageUrl }) {
  return (
    <div className="text-center space-y-5">
      <p className="text-gray-500 text-sm">Escanea este QR y transfiere exactamente:</p>
      <p className="text-4xl font-bold text-orange-500">Bs {total.toFixed(2)}</p>
      <div className="flex justify-center">
        <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-200 inline-block">
          {qrImageUrl ? (
            <img src={qrImageUrl} alt="QR de pago" className="w-48 h-48 object-contain" />
          ) : (
            <div className="w-48 h-48 flex items-center justify-center bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-400 text-center px-4">QR no configurado.<br />Contacta al administrador.</p>
            </div>
          )}
        </div>
      </div>
      <div className="bg-yellow-50 rounded-xl px-4 py-3 text-xs text-yellow-700 text-left">
        Escanea con tu app bancaria y transfiere el monto exacto. Luego confirma el pago aquí.
      </div>
      <button
        onClick={onConfirm}
        disabled={loading}
        className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition disabled:opacity-50"
      >
        {loading ? 'Confirmando...' : 'Ya realicé el pago'}
      </button>
    </div>
  )
}

export default function BuyerCheckout() {
  const { currentUser, userProfile } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(STEPS.method)
  const [payMethod, setPayMethod] = useState(null)
  const [loading, setLoading] = useState(false)
  const [orderIds, setOrderIds] = useState([])

  const [qrImageUrl, setQrImageUrl] = useState('')

  useEffect(() => {
    getPaymentSettings()
      .then((data) => { if (data?.qrImageUrl) setQrImageUrl(data.qrImageUrl) })
      .catch(() => {})
  }, [])

  const cart = JSON.parse(localStorage.getItem('cart') || '[]')
  const total = cart.reduce((s, i) => s + Number(i.price) * i.qty, 0)

  if (cart.length === 0 && step !== STEPS.confirm) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <Package size={48} className="mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500">Tu carrito está vacío</p>
          <button onClick={() => navigate('/buyer/catalog')} className="mt-4 px-6 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition">
            Ver catálogo
          </button>
        </div>
      </DashboardLayout>
    )
  }

  async function processPayment(method) {
    try {
      setLoading(true)
      const ids = await createOrder(
        currentUser.uid,
        userProfile.name,
        cart,
        method,
        total
      )
      setOrderIds(ids)
      localStorage.removeItem('cart')
      setStep(STEPS.confirm)
    } catch (err) {
      console.error('Error al procesar el pedido:', err)
      toast.error('Error al procesar el pedido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-lg mx-auto">

        {step !== STEPS.confirm && (
          <button onClick={() => step === STEPS.pay ? setStep(STEPS.method) : navigate('/buyer/cart')}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 transition">
            <ArrowLeft size={16} /> Volver
          </button>
        )}

        {/* Paso 1: Elegir método */}
        {step === STEPS.method && (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Método de pago</h2>
            <p className="text-gray-500 mb-6">Total a pagar: <strong className="text-orange-500">Bs {total.toFixed(2)}</strong></p>
            <div className="space-y-3">
              <button
                onClick={() => { setPayMethod('qr'); setStep(STEPS.pay) }}
                className="w-full flex items-center gap-4 p-5 bg-white rounded-2xl shadow-sm border-2 border-transparent hover:border-orange-400 transition"
              >
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
                  <QrCode size={24} className="text-orange-500" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-800">Pagar con QR</p>
                  <p className="text-xs text-gray-400">Escanea el código QR generado</p>
                </div>
              </button>
              <button
                onClick={() => { setPayMethod('card'); setStep(STEPS.pay) }}
                className="w-full flex items-center gap-4 p-5 bg-white rounded-2xl shadow-sm border-2 border-transparent hover:border-orange-400 transition"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                  <CreditCard size={24} className="text-blue-500" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-800">Pagar con tarjeta</p>
                  <p className="text-xs text-gray-400">Débito o crédito</p>
                </div>
              </button>
            </div>
          </>
        )}

        {/* Paso 2: Pagar */}
        {step === STEPS.pay && (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {payMethod === 'qr' ? 'Pago por QR' : 'Pago con tarjeta'}
            </h2>
            {payMethod === 'qr'
              ? <QRPayment total={total} onConfirm={() => processPayment('qr')} loading={loading} qrImageUrl={qrImageUrl} />
              : <CardForm onPay={() => processPayment('card')} loading={loading} />
            }
          </>
        )}

        {/* Paso 3: Confirmación */}
        {step === STEPS.confirm && (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle size={40} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Pedido confirmado!</h2>
            <p className="text-gray-500 mb-2">Tu pedido fue enviado al vendedor.</p>
            <p className="text-xs text-gray-400 mb-8">
              Pedido{orderIds.length > 1 ? 's' : ''}: {orderIds.map((id) => id.slice(0, 8)).join(', ')}
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate('/buyer/orders')}
                className="flex items-center justify-center gap-2 py-3.5 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition"
              >
                <ShoppingBag size={18} />
                Ver mis pedidos
              </button>
              <button
                onClick={() => navigate('/buyer/catalog')}
                className="py-3 text-sm font-medium text-gray-500 hover:text-gray-700 transition"
              >
                Seguir comprando
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
