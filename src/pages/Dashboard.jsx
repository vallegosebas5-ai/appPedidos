import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { userProfile } = useAuth()

  if (!userProfile) return null

  const redirects = {
    admin: '/admin',
    vendedor: '/seller',
    comprador: '/buyer',
  }

  return <Navigate to={redirects[userProfile.role] || '/login'} replace />
}
