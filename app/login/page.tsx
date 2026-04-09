"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/app/contexts/AuthContext"
import Button from "@/src/components/common/Button"
import Input from "@/src/components/common/Input"

export default function LoginPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
  })
  const [isEmployer, setIsEmployer] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const role = isEmployer ? "employer" : "young"
      await login(formData.emailOrPhone, formData.password, role)

      const user = JSON.parse(localStorage.getItem("mped_user") || "{}")
      if (user?.role === "employer") {
        router.push("/employer/dashboard")
      } else if (user?.role === "young") {
        router.push("/home")
      } else {
        router.push("/")
      }
    } catch (err) {
      setError("Credenciales inválidas. Intenta nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!resetEmail) {
      setError("Por favor ingresa tu correo electrónico")
      return
    }

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-soft-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
        {step === 1 && (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-display font-bold text-primary-dark mb-2">Iniciar sesión</h1>
              <p className="text-gray-soft-200">Ingresa tus credenciales para continuar</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                label="Correo o teléfono"
                type="text"
                placeholder="correo@ejemplo.com o +57 300 123 4567"
                value={formData.emailOrPhone}
                onChange={(e) => setFormData((prev) => ({ ...prev, emailOrPhone: e.target.value }))}
                error={error}
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

              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  id="login-is-employer"
                  type="checkbox"
                  checked={isEmployer}
                  onChange={(e) => setIsEmployer(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-gray-soft-200 text-primary-cyan focus:ring-primary-cyan"
                />
                <span className="text-sm text-gray-soft-300 leading-snug">
                  Soy empresa (acceso empleador)
                </span>
              </label>

              <div className="text-right">
                <button type="button" onClick={() => setStep(2)} className="text-sm text-primary-cyan hover:underline">
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              <Button type="submit" variant="primary" fullWidth disabled={loading}>
                {loading ? "Ingresando…" : "Iniciar sesión"}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-gray-soft-200">
                ¿No tienes cuenta?{" "}
                <Link href="/auth/young/register" className="text-primary-cyan hover:underline">
                  Regístrate como joven
                </Link>
              </p>
              <p className="text-sm text-gray-soft-200">
                o{" "}
                <Link href="/auth/employer/register" className="text-primary-cyan hover:underline">
                  Regístrate como empleador
                </Link>
              </p>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-display font-bold text-primary-dark mb-2">Recuperar contraseña</h1>
              <p className="text-gray-soft-200">
                Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña
              </p>
            </div>

            {!success ? (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <Input
                  label="Correo electrónico"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  error={error}
                  required
                />

                <Button type="submit" variant="primary" fullWidth disabled={loading}>
                  Enviar enlace
                </Button>

                <Button type="button" variant="ghost" fullWidth onClick={() => setStep(1)}>
                  Volver a iniciar sesión
                </Button>
              </form>
            ) : (
              <div className="text-center">
                <div className="text-6xl mb-6">📧</div>
                <h2 className="text-2xl font-display font-bold text-primary-dark mb-4">Enlace enviado</h2>
                <p className="text-gray-soft-200 mb-6">
                  Hemos enviado un enlace a <strong>{resetEmail}</strong> para restablecer tu contraseña.
                </p>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => {
                    setStep(1)
                    setSuccess(false)
                    setResetEmail("")
                  }}
                >
                  Volver a iniciar sesión
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
