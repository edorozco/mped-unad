import { createContext, useContext } from 'react'
import { useAuth } from './AuthContext'

const UserContext = createContext()

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within UserProvider')
  }
  return context
}

/** El perfil real ahora vive en `profiles` (API) y se resuelve en AuthContext (`user`). */
export function UserProvider({ children }) {
  const { user, updateUser } = useAuth()

  const updateProfile = (profileData) => updateUser(profileData)
  const completeProfile = () => updateUser({ profileComplete: true })

  const value = {
    profile: user,
    updateProfile,
    completeProfile,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
