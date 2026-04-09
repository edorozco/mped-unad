"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: number
  email?: string
  phone?: string
  role: "young" | "employer" | "admin"
  name: string
  photo?: string
  companyName?: string
  companyNIT?: string
  companyAddress?: string
  profileComplete?: boolean
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  login: (emailOrPhone: string, password: string, role?: string) => Promise<User>
  registerYoung: (phone: string, otp: string) => Promise<User>
  registerEmployer: (email: string, password: string, companyData: any) => Promise<User>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const savedUser = localStorage.getItem("mped_user")
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        setUser(parsedUser)
        setIsAuthenticated(true)
      } catch (error) {
        console.error("Error parsing saved user:", error)
        localStorage.removeItem("mped_user")
      }
    }
    setLoading(false)
  }, [])

  const login = async (emailOrPhone: string, password: string, role = null) => {
    return new Promise<User>((resolve) => {
      setTimeout(() => {
        const mockUser: User = {
          id: 1,
          email: emailOrPhone.includes("@") ? emailOrPhone : undefined,
          phone: !emailOrPhone.includes("@") ? emailOrPhone : undefined,
          role: (role || "young") as "young" | "employer" | "admin",
          name: role === "employer" ? "Empresa Demo" : "Usuario Demo",
        }

        setUser(mockUser)
        setIsAuthenticated(true)
        localStorage.setItem("mped_user", JSON.stringify(mockUser))
        resolve(mockUser)
      }, 500)
    })
  }

  const registerYoung = async (phone: string, otp: string) => {
    return new Promise<User>((resolve) => {
      setTimeout(() => {
        const newUser: User = {
          id: Date.now(),
          phone,
          role: "young",
          name: "Nuevo Usuario",
          profileComplete: false,
        }

        setUser(newUser)
        setIsAuthenticated(true)
        localStorage.setItem("mped_user", JSON.stringify(newUser))
        resolve(newUser)
      }, 500)
    })
  }

  const registerEmployer = async (email: string, password: string, companyData: any) => {
    return new Promise<User>((resolve) => {
      setTimeout(() => {
        const newUser: User = {
          id: Date.now(),
          email,
          role: "employer",
          name: companyData.companyName,
          companyName: companyData.companyName,
          companyNIT: companyData.companyNIT,
          companyAddress: companyData.companyAddress,
        }

        setUser(newUser)
        setIsAuthenticated(true)
        localStorage.setItem("mped_user", JSON.stringify(newUser))
        resolve(newUser)
      }, 500)
    })
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("mped_user")
    router.push("/")
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem("mped_user", JSON.stringify(updatedUser))
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated,
    loading,
    login,
    registerYoung,
    registerEmployer,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
