import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const UserContext = createContext()

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within UserProvider')
  }
  return context
}

export function UserProvider({ children }) {
  const { user, updateUser } = useAuth()
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    if (user) {
      // Load profile from localStorage or use default
      const savedProfile = localStorage.getItem(`mped_profile_${user.id}`)
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile))
      } else {
        // Initialize with user data
        setProfile({
          name: user.name || '',
          photo: user.photo || '',
          skills: user.skills || [],
          availability: user.availability || {},
          interests: user.interests || [],
          profileComplete: user.profileComplete || false
        })
      }
    }
  }, [user])

  const updateProfile = (profileData) => {
    const updatedProfile = { ...profile, ...profileData }
    setProfile(updatedProfile)
    
    if (user) {
      localStorage.setItem(`mped_profile_${user.id}`, JSON.stringify(updatedProfile))
      updateUser(updatedProfile)
    }
  }

  const completeProfile = () => {
    const completedProfile = { ...profile, profileComplete: true }
    setProfile(completedProfile)
    
    if (user) {
      localStorage.setItem(`mped_profile_${user.id}`, JSON.stringify(completedProfile))
      updateUser(completedProfile)
    }
  }

  const value = {
    profile,
    updateProfile,
    completeProfile
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
