"use client"

import { useAuth } from "@/app/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Header from "@/src/components/layout/Header"
import Button from "@/src/components/common/Button"
import Input from "@/src/components/common/Input"

export default function YoungProfilePage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>
  }

  return (
    <div className="min-h-screen bg-gray-soft-50">
      <Header />
      <div className="container-custom py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-display font-bold text-primary-dark mb-6">Completa tu perfil</h1>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-primary-dark mb-2">Nombre</label>
              <Input type="text" placeholder="Tu nombre completo" defaultValue={user.name} className="border-[#333]" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-primary-dark mb-2">Teléfono</label>
              <Input type="tel" placeholder="+57 300 123 4567" defaultValue={user.phone || ""} className="border-[#333]" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-primary-dark mb-2">Habilidades</label>
              <Input type="text" placeholder="Ej: Ventas, Marketing, Diseño" className="border-[#333]" />
            </div>

            <div className="flex gap-4">
              <Button variant="primary" fullWidth>
                Guardar perfil
              </Button>
              <Button variant="outline" fullWidth onClick={() => router.push("/home")}>
                Saltar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
