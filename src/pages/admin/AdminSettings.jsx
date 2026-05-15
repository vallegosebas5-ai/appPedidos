import { useEffect, useRef, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { getPaymentSettings, updatePaymentSettings } from '../../services/settings'
import toast from 'react-hot-toast'
import { Upload, QrCode, Save } from 'lucide-react'

export default function AdminSettings() {
  const [qrUrl, setQrUrl] = useState('')
  const [preview, setPreview] = useState(null)
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const inputRef = useRef(null)

  useEffect(() => {
    getPaymentSettings().then((data) => {
      if (data.qrImageUrl) setQrUrl(data.qrImageUrl)
      setFetching(false)
    })
  }, [])

  function handleFile(e) {
    const f = e.target.files[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  async function handleSave() {
    if (!file && !qrUrl) {
      toast.error('Sube una imagen QR primero')
      return
    }
    try {
      setLoading(true)
      const res = await updatePaymentSettings(file || null)
      if (res.qrImageUrl) setQrUrl(res.qrImageUrl)
      setFile(null)
      toast.success('QR de pago guardado')
    } catch (err) {
      console.error(err)
      toast.error(err.message || 'Error al guardar el QR')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Configuración de pagos</h1>
        <p className="text-gray-400 text-sm mb-8">Sube el QR estático de tu cuenta bancaria para recibir pagos</p>

        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-8 space-y-6">

          {/* Vista previa del QR */}
          <div className="flex flex-col items-center gap-4">
            {fetching ? (
              <div className="w-56 h-56 bg-gray-100 rounded-2xl animate-pulse" />
            ) : (preview || qrUrl) ? (
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                <img
                  src={preview || qrUrl}
                  alt="QR de pago"
                  className="w-56 h-56 object-contain"
                />
              </div>
            ) : (
              <div className="w-56 h-56 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-3 text-gray-300">
                <QrCode size={48} />
                <p className="text-sm">Sin QR configurado</p>
              </div>
            )}

            <button
              type="button"
              onClick={() => inputRef.current.click()}
              className="flex items-center gap-2 px-5 py-2.5 bg-orange-50 hover:bg-orange-100 text-orange-600 font-semibold text-sm rounded-xl transition"
            >
              <Upload size={16} />
              {qrUrl ? 'Cambiar imagen QR' : 'Subir imagen QR'}
            </button>
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </div>

          <p className="text-xs text-gray-400 text-center">
            Sube la imagen QR que te dio tu banco (Banco Unión, BNB, etc.). Los compradores la verán al pagar.
          </p>

          <button
            onClick={handleSave}
            disabled={loading || (!file && !qrUrl)}
            className="w-full flex items-center justify-center gap-2 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition disabled:opacity-40"
          >
            <Save size={17} />
            {loading ? 'Guardando...' : 'Guardar QR'}
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}
