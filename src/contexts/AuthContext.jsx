import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { api } from '../lib/apiClient'

const AuthContext = createContext()

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

/** Alias de compatibilidad: el resto de la app espera `user.id` y `user.photo`. */
function withAliases(profile) {
  return { ...profile, id: profile.userId, photo: profile.photoUrl }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const loadProfile = async () => {
    try {
      const profile = await api.get('/api/profiles/me')
      const withId = withAliases(profile)
      setUser(withId)
      setIsAuthenticated(true)
      return withId
    } catch (error) {
      console.error('No se pudo cargar el perfil:', error)
      setUser(null)
      setIsAuthenticated(false)
      return null
    }
  }

  useEffect(() => {
    let mounted = true

    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session) {
        await loadProfile()
      }
      if (mounted) setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null)
        setIsAuthenticated(false)
      } else if (session) {
        await loadProfile()
      }
    })

    return () => {
      mounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  const login = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return loadProfile()
  }

  const register = async ({ name, email, password, city, role, businessName, nit, consents }) => {
    const { error: signUpError } = await supabase.auth.signUp({ email, password })
    if (signUpError) throw signUpError

    const profile = await api.post('/api/profiles', { role, name, city, businessName, nit, consents })
    const withId = withAliases(profile)
    setUser(withId)
    setIsAuthenticated(true)
    return withId
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setIsAuthenticated(false)
    navigate('/')
  }

  /** Acepta tanto `photo` (alias usado en el resto de la app) como `photoUrl`. */
  const updateUser = async (userData) => {
    const { photo, ...rest } = userData
    const payload = photo !== undefined ? { ...rest, photoUrl: photo } : rest

    const updated = await api.put('/api/profiles/me', payload)
    const withId = withAliases(updated)
    setUser(withId)
    return withId
  }

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
