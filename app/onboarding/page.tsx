"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import Button from "@/src/components/common/Button"

export default function OnboardingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-dark to-primary-dark/90 text-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">Bienvenido a MPED</h1>
          <p className="text-xl text-gray-soft-100 mb-8">Elige tu rol para comenzar a conectarte con oportunidades</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Young Worker Option */}
          <div className="bg-white/10 backdrop-blur rounded-2xl p-8 hover:bg-white/20 transition-all">
            <div className="text-6xl mb-6">👨‍💼</div>
            <h2 className="text-2xl font-display font-bold mb-4">Soy Joven</h2>
            <p className="text-gray-soft-100 mb-6">
              Busco oportunidades de trabajo que se adapten a mi disponibilidad y habilidades
            </p>
            <Button variant="primary" fullWidth onClick={() => router.push("/auth/young/register")}>
              Registrarse como joven
            </Button>
            <p className="text-sm text-gray-soft-100 mt-4">
              Ya tengo cuenta{" "}
              <Link href="/login" className="text-primary-cyan hover:underline">
                Iniciar sesión
              </Link>
            </p>
          </div>

          {/* Employer Option */}
          <div className="bg-white/10 backdrop-blur rounded-2xl p-8 hover:bg-white/20 transition-all">
            <div className="text-6xl mb-6">🏢</div>
            <h2 className="text-2xl font-display font-bold mb-4">Soy Empleador</h2>
            <p className="text-gray-soft-100 mb-6">
              Busco talento joven para proyectos que requieren dedicación y creatividad
            </p>
            <Button variant="primary" fullWidth onClick={() => router.push("/auth/employer/register")}>
              Registrarse como empleador
            </Button>
            <p className="text-sm text-gray-soft-100 mt-4">
              Ya tengo cuenta{" "}
              <Link href="/login" className="text-primary-cyan hover:underline">
                Iniciar sesión
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-12 flex gap-4 justify-center items-center text-sm text-gray-soft-100">
          <Link href="/" className="hover:text-white">
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
