"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/app/contexts/AuthContext"
import { useJobs } from "@/app/contexts/JobsContext"
import { useRouter } from "next/navigation"
import Header from "@/src/components/layout/Header"
import Button from "@/src/components/common/Button"
import Input from "@/src/components/common/Input"

export default function CreateJobPage() {
  const { user } = useAuth()
  const { createJob } = useJobs()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    payment: "",
    duration: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const newJob = createJob({
        ...formData,
        company: user?.companyName || user?.name,
        payment: Number.parseInt(formData.payment),
      })

      setTimeout(() => {
        setLoading(false)
        router.push("/employer/dashboard")
      }, 500)
    } catch (error) {
      setLoading(false)
      console.error("Error creating job:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-soft-50">
      <Header />
      <div className="container-custom py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-display font-bold text-primary-dark mb-6">Crear nuevo trabajo</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Título del trabajo"
              type="text"
              placeholder="Ej: Promotor de ventas"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              required
              className="border-[#333]"
            />

            <div>
              <label className="block text-sm font-semibold text-primary-dark mb-2">Categoría</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border-2 border-[#333] focus:outline-none focus:border-primary-cyan"
                required
              >
                <option value="">Selecciona una categoría</option>
                <option value="Ventas">Ventas</option>
                <option value="Marketing">Marketing</option>
                <option value="Reparto">Reparto</option>
                <option value="Eventos">Eventos</option>
                <option value="Fotografía">Fotografía</option>
                <option value="Educación">Educación</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-primary-dark mb-2">Descripción</label>
              <textarea
                placeholder="Describe el trabajo en detalle"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border-2 border-[#333] focus:outline-none focus:border-primary-cyan"
                rows={5}
                required
              />
            </div>

            <Input
              label="Pago (COP)"
              type="number"
              placeholder="50000"
              value={formData.payment}
              onChange={(e) => setFormData((prev) => ({ ...prev, payment: e.target.value }))}
              required
              className="border-[#333]"
            />

            <Input
              label="Duración estimada"
              type="text"
              placeholder="Ej: 2 horas, 1 día, 1 semana"
              value={formData.duration}
              onChange={(e) => setFormData((prev) => ({ ...prev, duration: e.target.value }))}
              required
              className="border-[#333]"
            />

            <div className="flex gap-4">
              <Button type="submit" variant="primary" fullWidth disabled={loading}>
                {loading ? "Creando..." : "Crear trabajo"}
              </Button>
              <Button type="button" variant="outline" fullWidth onClick={() => router.push("/employer/dashboard")}>
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
