"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/app/contexts/AuthContext"
import Button from "@/src/components/common/Button"
import Input from "@/src/components/common/Input"

export default function EmployerRegisterPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    companyNIT: "",
    companyAddress: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { registerEmployer } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    setLoading(true)

    try {
      await registerEmployer(formData.email, formData.password, {
        companyName: formData.companyName,
        companyNIT: formData.companyNIT,
        companyAddress: formData.companyAddress,
      })

      setTimeout(() => {
        setLoading(false)
        setStep(2)
      }, 500)
    } catch (err) {
      setError("Error al registrar. Intenta nuevamente.")
      setLoading(false)
    }
  }

  const handleContinue = () => {
    router.push("/employer/dashboard")
  }

  return (
    <div className="min-h-screen bg-gray-soft-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
        {step === 1 && (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-display font-bold text-primary-dark mb-2">Regístrate como Empleador</h1>
              <p className="text-gray-soft-200">Crea tu cuenta empresarial</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Nombre de empresa"
                type="text"
                placeholder="Mi Empresa"
                value={formData.companyName}
                onChange={(e) => setFormData((prev) => ({ ...prev, companyName: e.target.value }))}
                required
              />

              <Input
                label="NIT"
                type="text"
                placeholder="123456789"
                value={formData.companyNIT}
                onChange={(e) => setFormData((prev) => ({ ...prev, companyNIT: e.target.value }))}
                required
              />

              <Input
                label="Dirección"
                type="text"
                placeholder="Calle 1 # 2-3"
                value={formData.companyAddress}
                onChange={(e) => setFormData((prev) => ({ ...prev, companyAddress: e.target.value }))}
                required
              />

              <Input
                label="Correo electrónico"
                type="email"
                placeholder="empresa@ejemplo.com"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                required
              />

              <Input
                label="Contraseña"
                type="password"
                placeholder="Ingresa tu contraseña"
                value={formData.password}
                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                required
              />

              <Input
                label="Confirmar contraseña"
                type="password"
                placeholder="Confirma tu contraseña"
                value={formData.confirmPassword}
                onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                error={error}
                required
              />

              <Button type="submit" variant="primary" fullWidth disabled={loading}>
                {loading ? "Registrando..." : "Registrarse"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-soft-200">
                Ya tengo cuenta{" "}
                <Link href="/login" className="text-primary-cyan hover:underline">
                  Iniciar sesión
                </Link>
              </p>
            </div>
          </>
        )}

        {step === 2 && (
          <div className="text-center py-4">
            <div className="text-6xl mb-6">✅</div>
            <h1 className="text-3xl font-display font-bold text-primary-dark mb-4">¡Registro exitoso!</h1>
            <p className="text-gray-soft-200 mb-8">Tu cuenta empresarial ha sido creada correctamente.</p>
            <Button variant="primary" fullWidth onClick={handleContinue}>
              Ir al panel
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
