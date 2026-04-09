"use client"

import { useAuth } from "@/app/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Header from "@/src/components/layout/Header"
import Button from "@/src/components/common/Button"

export default function EmployerDashboardPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "employer") {
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
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-primary-dark mb-2">Panel de Empleador</h1>
          <p className="text-[#333]">Bienvenido, {user.companyName || user.name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow">
            <div className="text-4xl font-bold text-primary-cyan mb-2">0</div>
            <p className="text-[#333]">Trabajos activos</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow">
            <div className="text-4xl font-bold text-primary-cyan mb-2">0</div>
            <p className="text-[#333]">Aplicantes</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow">
            <div className="text-4xl font-bold text-primary-cyan mb-2">0</div>
            <p className="text-[#333]">Trabajos completados</p>
          </div>
        </div>

        <Button variant="primary" onClick={() => router.push("/employer/create-job")}>
          Crear nuevo trabajo
        </Button>
      </div>
    </div>
  )
}
