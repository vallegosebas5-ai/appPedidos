import { useState, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import { fileToBase64 } from '../../services/api'
import DashboardLayout from '../../components/layout/DashboardLayout'
import toast from 'react-hot-toast'
import { Camera, Save, User } from 'lucide-react'

export default function EditProfile() {
  const { userProfile, updateUserProfile } = useAuth()
  const [name, setName] = useState(userProfile?.name || '')
  const [photoPreview, setPhotoPreview] = useState(userProfile?.photo || null)
  const [photoFile, setPhotoFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const photoInputRef = useRef(null)

  function handlePhotoChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  async function handleSave(e) {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('El nombre no puede estar vacío')
      return
    }
    try {
      setLoading(true)
      const updates = { name: name.trim() }
      if (photoFile) updates.photo = await fileToBase64(photoFile)
      await updateUserProfile(updates)
      toast.success('Perfil actualizado')
      setPhotoFile(null)
    } catch {
      toast.error('Error al actualizar el perfil')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Editar perfil</h1>

        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-8">
          <form onSubmit={handleSave} className="space-y-6">

            {/* Avatar */}
            <div className="flex flex-col items-center gap-3">
              <div
                className="relative w-24 h-24 rounded-full cursor-pointer group"
                onClick={() => photoInputRef.current.click()}
              >
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Foto de perfil"
                    className="w-24 h-24 rounded-full object-cover border-4 border-orange-200"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center border-4 border-orange-200">
                    <span className="text-white font-black text-3xl">
                      {userProfile?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <Camera size={20} className="text-white" />
                </div>
              </div>
              <button
                type="button"
                onClick={() => photoInputRef.current.click()}
                className="text-sm text-orange-500 font-medium hover:underline"
              >
                Cambiar foto
              </button>
              {photoPreview && photoPreview !== (userProfile?.photo || null) && (
                <button
                  type="button"
                  onClick={() => { setPhotoPreview(userProfile?.photo || null); setPhotoFile(null) }}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  Cancelar cambio de foto
                </button>
              )}
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </div>

            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                  placeholder="Tu nombre completo"
                />
              </div>
            </div>

            {/* Correo (solo lectura) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                value={userProfile?.email || ''}
                disabled
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-1">El correo no se puede cambiar</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={17} />
              {loading ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}
