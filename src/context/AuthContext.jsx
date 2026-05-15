import { createContext, useContext, useEffect, useState } from 'react'
import { apiFetch, fileToBase64 } from '../services/api'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser]   = useState(null)
  const [userProfile, setUserProfile]   = useState(null)
  const [loading, setLoading]           = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { setLoading(false); return }
    apiFetch('/auth/me.php')
      .then((user) => {
        setCurrentUser({ uid: user.uid })
        setUserProfile(user)
      })
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false))
  }, [])

  async function register(email, password, name, role, photoFile = null) {
    const photo = photoFile ? await fileToBase64(photoFile) : ''
    const res = await apiFetch('/auth/register.php', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, role, photo }),
    })
    localStorage.setItem('token', res.token)
    setCurrentUser({ uid: res.user.uid })
    setUserProfile(res.user)
  }

  async function login(email, password) {
    const res = await apiFetch('/auth/login.php', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    localStorage.setItem('token', res.token)
    setCurrentUser({ uid: res.user.uid })
    setUserProfile(res.user)
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('cart')
    setCurrentUser(null)
    setUserProfile(null)
  }

  async function fetchUserProfile(uid) {
    const user = await apiFetch('/auth/me.php')
    setUserProfile(user)
  }

  async function updateUserProfile(data) {
    const updated = await apiFetch('/users/update.php', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    setUserProfile((prev) => ({ ...prev, ...updated }))
  }

  const value = {
    currentUser,
    userProfile,
    register,
    login,
    logout,
    fetchUserProfile,
    updateUserProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
