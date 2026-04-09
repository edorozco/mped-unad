"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "./AuthContext"

interface Profile {
  name: string
  photo?: string
  skills: string[]
  availability: Record<string, any>
  interests: string[]
  profileComplete: boolean
}

interface UserContextType {
  profile: Profile | null
  updateProfile: (profileData: Partial<Profile>) => void
  completeProfile: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUser must be used within UserProvider")
  }
  return context
}

export function UserProvider({ children }: { children: ReactNode }) {
  const { user, updateUser } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    if (user) {
      const savedProfile = localStorage.getItem(`mped_profile_${user.id}`)
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile))
      } else {
        setProfile({
          name: user.name || "",
          photo: user.photo || "",
          skills: user.skills || [],
          availability: user.availability || {},
          interests: user.interests || [],
          profileComplete: user.profileComplete || false,
        })
      }
    }
  }, [user])

  const updateProfile = (profileData: Partial<Profile>) => {
    if (profile && user) {
      const updatedProfile = { ...profile, ...profileData }
      setProfile(updatedProfile)
      localStorage.setItem(`mped_profile_${user.id}`, JSON.stringify(updatedProfile))
      updateUser(updatedProfile)
    }
  }

  const completeProfile = () => {
    if (profile && user) {
      const completedProfile = { ...profile, profileComplete: true }
      setProfile(completedProfile)
      localStorage.setItem(`mped_profile_${user.id}`, JSON.stringify(completedProfile))
      updateUser(completedProfile)
    }
  }

  const value: UserContextType = {
    profile,
    updateProfile,
    completeProfile,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
