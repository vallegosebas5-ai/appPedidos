import { useEffect, useRef, useState } from 'react'
import { getCoinPackages, purchaseCoins } from '../../services/coins'
import { getPaymentSettings } from '../../services/settings'
import { useAuth } from '../../context/AuthContext'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Coins, Package, CreditCard, QrCode, X, CheckCircle, ArrowLeft } from 'lucide-react'

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
        <input placeholder="Juan Pérez"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
          {...register('cardName', { required: true })} />
        {errors.cardName && <p className="text-red-500 text-xs mt-1">Requerido</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Número de tarjeta</label>
        <input placeholder="0000 0000 0000 0000" onInput={formatCard}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm font-mono"
          {...register('cardNumber', { required: true, minLength: 19 })} />
        {errors.cardNumber && <p className="text-red-500 text-xs mt-1">Número inválido</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Vencimiento</label>
          <input placeholder="MM/AA" onInput={formatExpiry}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm font-mono"
            {...register('expiry', { required: true, minLength: 5 })} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
          <input placeholder="123" type="password" maxLength={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm font-mono"
            {...register('cvv', { required: true, minLength: 3 })} />
        </div>
      </div>
      <button type="submit" disabled={loading}
        className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition disabled:opacity-50">
        {loading ? 'Procesando...' : 'Pagar con tarjeta'}
      </button>
    </form>
  )
}

function PaymentModal({ pkg, qrImageUrl, onClose, onSuccess }) {
  const [step, setStep] = useState('method') // method | qr | card
  const [loading, setLoading] = useState(false)
  const { currentUser, fetchUserProfile } = useAuth()

  async function confirmPayment() {
    try {
      setLoading(true)
      await purchaseCoins(currentUser.uid, pkg.id, pkg.coins, pkg.price)
      await fetchUserProfile(currentUser.uid)
      onSuccess(pkg)
    } catch {
      toast.error('Error al acreditar las monedas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-xl hover:bg-gray-100 transition">
          <X size={18} className="text-gray-500" />
        </button>

        {/* Resumen del paquete */}
        <div className="bg-orange-50 rounded-2xl p-4 mb-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
            <Coins size={22} className="text-orange-500" />
          </div>
          <div>
            <p className="font-bold text-gray-800">{pkg.name}</p>
            <p className="text-sm text-gray-500">{pkg.coins} monedas · <span className="font-bold text-orange-500">Bs {pkg.price}</span></p>
          </div>
        </div>

        {/* Paso: elegir método */}
        {step === 'method' && (
          <>
            <h3 className="font-bold text-gray-800 mb-4">Elige método de pago</h3>
            <div className="space-y-3">
              <button onClick={() => setStep('qr')}
                className="w-full flex items-center gap-4 p-4 bg-white rounded-2xl border-2 border-gray-100 hover:border-orange-400 transition">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
                  <QrCode size={20} className="text-orange-500" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-800 text-sm">Pagar con QR</p>
                  <p className="text-xs text-gray-400">Escanea el QR del administrador</p>
                </div>
              </button>
              <button onClick={() => setStep('card')}
                className="w-full flex items-center gap-4 p-4 bg-white rounded-2xl border-2 border-gray-100 hover:border-orange-400 transition">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                  <CreditCard size={20} className="text-blue-500" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-800 text-sm">Pagar con tarjeta</p>
                  <p className="text-xs text-gray-400">Débito o crédito</p>
                </div>
              </button>
            </div>
          </>
        )}

        {/* Paso: QR */}
        {step === 'qr' && (
          <>
            <button onClick={() => setStep('method')} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 mb-4 transition">
              <ArrowLeft size={14} /> Volver
            </button>
            <div className="text-center space-y-4">
              <p className="text-gray-500 text-sm">Transfiere exactamente <span className="font-bold text-orange-500">Bs {pkg.price}</span> escaneando este QR:</p>
              <div className="flex justify-center">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 inline-block">
                  {qrImageUrl ? (
                    <img src={qrImageUrl} alt="QR de pago" className="w-44 h-44 object-contain" />
                  ) : (
                    <div className="w-44 h-44 flex items-center justify-center">
                      <p className="text-xs text-gray-400 text-center px-4">QR no configurado.<br />Contacta al administrador.</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-yellow-50 rounded-xl px-4 py-3 text-xs text-yellow-700 text-left">
                Escanea con tu app bancaria y transfiere el monto exacto. Luego confirma aquí.
              </div>
              <button onClick={confirmPayment} disabled={loading}
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition disabled:opacity-50">
                {loading ? 'Acreditando monedas...' : 'Ya realicé el pago'}
              </button>
            </div>
          </>
        )}

        {/* Paso: Tarjeta */}
        {step === 'card' && (
          <>
            <button onClick={() => setStep('method')} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 mb-4 transition">
              <ArrowLeft size={14} /> Volver
            </button>
            <CardForm onPay={confirmPayment} loading={loading} />
          </>
        )}
      </div>
    </div>
  )
}

export default function SellerCoins() {
  const { userProfile } = useAuth()
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [qrImageUrl, setQrImageUrl] = useState('')
  const [selectedPkg, setSelectedPkg] = useState(null)
  const [successPkg, setSuccessPkg] = useState(null)

  useEffect(() => {
    getCoinPackages()
      .then((data) => setPackages(data))
      .catch((err) => console.error('Error cargando paquetes:', err))
      .finally(() => setLoading(false))
    getPaymentSettings()
      .then((data) => { if (data?.qrImageUrl) setQrImageUrl(data.qrImageUrl) })
      .catch(() => {})
  }, [])

  function handleSuccess(pkg) {
    setSelectedPkg(null)
    setSuccessPkg(pkg)
    toast.success(`¡Compraste ${pkg.coins} monedas!`)
  }

  return (
    <DashboardLayout>
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Comprar Monedas</h2>
        <p className="text-gray-500 mb-6">Las monedas te permiten publicar productos en el catálogo</p>

        {/* Balance */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-400 rounded-2xl p-6 mb-8 text-white flex items-center gap-5">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
            <Coins size={28} className="text-white" />
          </div>
          <div>
            <p className="text-orange-100 text-sm">Tu saldo actual</p>
            <p className="text-4xl font-bold">{userProfile?.coins ?? 0}</p>
            <p className="text-orange-100 text-sm">monedas disponibles</p>
          </div>
        </div>

        {/* Confirmación de compra */}
        {successPkg && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-6 flex items-start gap-4">
            <CheckCircle size={24} className="text-green-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-green-800">¡Compra exitosa!</p>
              <p className="text-sm text-green-600 mt-1">
                Se acreditaron <strong>{successPkg.coins} monedas</strong> a tu cuenta. Ya puedes publicar productos.
              </p>
              <button onClick={() => setSuccessPkg(null)} className="mt-2 text-xs text-green-500 underline">Cerrar</button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-400">Cargando paquetes...</div>
        ) : packages.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Package size={40} className="mx-auto mb-3 opacity-30" />
            <p>El administrador aún no ha creado paquetes de monedas</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {packages.map((pkg) => (
              <div key={pkg.id} className={`bg-white rounded-2xl p-6 shadow-sm relative ${pkg.popular ? 'ring-2 ring-orange-400' : ''}`}>
                {pkg.popular && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-orange-500 text-white text-xs font-bold rounded-full">
                    Más popular
                  </span>
                )}
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                  <Coins size={22} className="text-orange-500" />
                </div>
                <h3 className="font-bold text-xl text-gray-800">{pkg.name}</h3>
                <div className="flex items-baseline gap-1 my-3">
                  <span className="text-4xl font-bold text-orange-500">{pkg.coins}</span>
                  <span className="text-gray-400 text-sm">monedas</span>
                </div>
                <p className="text-sm text-gray-500 mb-1">Publica hasta <strong>{pkg.coins} productos</strong></p>
                <p className="text-2xl font-bold text-gray-800 mt-3">Bs {pkg.price}</p>
                <button
                  onClick={() => setSelectedPkg(pkg)}
                  className={`mt-5 w-full py-3 rounded-xl font-semibold transition text-sm ${
                    pkg.popular
                      ? 'bg-orange-500 hover:bg-orange-600 text-white'
                      : 'bg-orange-50 hover:bg-orange-100 text-orange-600'
                  }`}
                >
                  Comprar ahora
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedPkg && (
        <PaymentModal
          pkg={selectedPkg}
          qrImageUrl={qrImageUrl}
          onClose={() => setSelectedPkg(null)}
          onSuccess={handleSuccess}
        />
      )}
    </DashboardLayout>
  )
}
