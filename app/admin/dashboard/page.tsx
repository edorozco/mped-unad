"use client"

import { useAuth } from "@/app/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Header from "@/src/components/layout/Header"

export default function AdminDashboardPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/login")
    }
  }, [isAuthenticated, user, router])

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>
  }

  return (
    <div className="min-h-screen bg-gray-soft-50">
      <Header />
      <div className="container-custom py-8">
        <h1 className="text-4xl font-display font-bold text-primary-dark mb-2">Panel de Administración</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-white rounded-2xl p-6 shadow">
            <div className="text-4xl font-bold text-primary-cyan mb-2">2,500</div>
            <p className="text-gray-soft-200">Jóvenes activos</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow">
            <div className="text-4xl font-bold text-primary-cyan mb-2">890</div>
            <p className="text-gray-soft-200">Empleadores</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow">
            <div className="text-4xl font-bold text-primary-cyan mb-2">1,234</div>
            <p className="text-gray-soft-200">Trabajos completados</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow">
            <div className="text-4xl font-bold text-primary-cyan mb-2">$2.3M</div>
            <p className="text-gray-soft-200">Pagado total</p>
          </div>
        </div>
      </div>
    </div>
  )
}
