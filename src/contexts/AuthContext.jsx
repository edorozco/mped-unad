import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Check localStorage for existing session
    const savedUser = localStorage.getItem('mped_user')
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        setUser(parsedUser)
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Error parsing saved user:', error)
        localStorage.removeItem('mped_user')
      }
    }
    setLoading(false)
  }, [])

  const login = async (emailOrPhone, password, role = null) => {
    // Mock login - in real app, this would call an API
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate successful login
        const mockUser = {
          id: 1,
          email: emailOrPhone.includes('@') ? emailOrPhone : null,
          phone: !emailOrPhone.includes('@') ? emailOrPhone : null,
          role: role || 'young',
          name: role === 'employer' ? 'Empresa Demo' : 'Usuario Demo'
        }
        
        setUser(mockUser)
        setIsAuthenticated(true)
        localStorage.setItem('mped_user', JSON.stringify(mockUser))
        resolve(mockUser)
      }, 500)
    })
  }

  const register = async ({ name, email, password, city, role, businessName, nit }) => {
    // Mock registration — unified form for young/employer roles
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser = {
          id: Date.now(),
          name,
          email,
          city,
          role,
          profileComplete: false,
          ...(role === 'employer' ? { businessName, nit } : {})
        }

        setUser(newUser)
        setIsAuthenticated(true)
        localStorage.setItem('mped_user', JSON.stringify(newUser))
        resolve(newUser)
      }, 800)
    })
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('mped_user')
    navigate('/')
  }

  const updateUser = (userData) => {
    const updatedUser = { ...user, ...userData }
    setUser(updatedUser)
    localStorage.setItem('mped_user', JSON.stringify(updatedUser))
  }

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateUser
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
