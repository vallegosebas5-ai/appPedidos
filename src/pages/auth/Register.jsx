import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { Camera } from 'lucide-react'

const ROLES = [
  { value: 'comprador', label: 'Comprador', desc: 'Compra productos de vendedores' },
  { value: 'vendedor', label: 'Vendedor', desc: 'Publica y vende tus productos' },
]

export default function Register() {
  const { register: registerUser, currentUser } = useAuth()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState('comprador')
  const [photoPreview, setPhotoPreview] = useState(null)
  const [photoFile, setPhotoFile] = useState(null)
  const photoInputRef = useRef(null)
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const password = watch('password')

  if (currentUser) return <Navigate to="/dashboard" replace />

  function handlePhotoChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  async function onSubmit(data) {
    try {
      setLoading(true)
      await registerUser(data.email, data.password, data.name, selectedRole, photoFile || null)
      toast.success('Cuenta creada exitosamente')
      navigate('/dashboard')
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        toast.error('Este correo ya está registrado')
      } else {
        toast.error('Error al crear la cuenta')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Link to="/"><img src="/wechi1.png" alt="Wechi" className="h-16 w-auto" /></Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Wechi</h1>
          <p className="text-gray-500 mt-1">Crea tu cuenta</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Foto de perfil */}
            <div className="flex flex-col items-center gap-2">
              <div
                className="relative w-20 h-20 rounded-full cursor-pointer group"
                onClick={() => photoInputRef.current.click()}
              >
                {photoPreview ? (
                  <img src={photoPreview} alt="Foto de perfil" className="w-20 h-20 rounded-full object-cover border-2 border-orange-300" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-orange-100 border-2 border-dashed border-orange-300 flex items-center justify-center">
                    <Camera size={24} className="text-orange-400" />
                  </div>
                )}
                <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <Camera size={18} className="text-white" />
                </div>
              </div>
              <span className="text-xs text-gray-400">Foto de perfil (opcional)</span>
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo
              </label>
              <input
                type="text"
                placeholder="Juan Pérez"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                {...register('name', { required: 'El nombre es requerido' })}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                placeholder="tu@correo.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                {...register('email', { required: 'El correo es requerido' })}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                placeholder="Mínimo 6 caracteres"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                {...register('password', {
                  required: 'La contraseña es requerida',
                  minLength: { value: 6, message: 'Mínimo 6 caracteres' },
                })}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar contraseña
              </label>
              <input
                type="password"
                placeholder="Repite tu contraseña"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                {...register('confirmPassword', {
                  required: 'Confirma tu contraseña',
                  validate: (v) => v === password || 'Las contraseñas no coinciden',
                })}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de cuenta
              </label>
              <div className="grid grid-cols-2 gap-3">
                {ROLES.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setSelectedRole(r.value)}
                    className={`p-3 rounded-xl border-2 text-left transition ${
                      selectedRole === r.value
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <p className="font-semibold text-sm text-gray-800">{r.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-orange-500 font-medium hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
