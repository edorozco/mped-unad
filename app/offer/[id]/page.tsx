"use client"

import { useParams, useRouter } from "next/navigation"
import { useJobs } from "@/app/contexts/JobsContext"
import { useAuth } from "@/app/contexts/AuthContext"
import Header from "@/src/components/layout/Header"
import Button from "@/src/components/common/Button"

export default function OfferDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { getJobById, applyToJob } = useJobs()
  const { user } = useAuth()

  const job = getJobById(params.id as string)

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-soft-50">
        <Header />
        <div className="container-custom py-8 text-center">
          <h1 className="text-2xl font-bold text-primary-dark">Oferta no encontrada</h1>
          <Button variant="outline" onClick={() => router.push("/home")} className="mt-4">
            Volver a ofertas
          </Button>
        </div>
      </div>
    )
  }

  const handleApply = () => {
    if (user) {
      applyToJob(job.id, user.id)
      alert("Aplicación enviada exitosamente")
      router.push("/home")
    }
  }

  return (
    <div className="min-h-screen bg-gray-soft-50">
      <Header />
      <div className="container-custom py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <button onClick={() => router.back()} className="text-primary-cyan hover:underline mb-6">
            ← Volver
          </button>

          <div className="mb-6">
            <span className="inline-block bg-primary-cyan text-white px-3 py-1 rounded-full text-sm font-semibold mb-4">
              {job.category}
            </span>
            <h1 className="text-4xl font-display font-bold text-primary-dark mb-2">{job.title}</h1>
            <p className="text-gray-soft-200 text-lg">{job.company}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8 p-4 bg-gray-soft-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-soft-200">Pago</p>
              <p className="text-2xl font-bold text-primary-dark">${job.payment.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-soft-200">Duración</p>
              <p className="text-2xl font-bold text-primary-dark">{job.duration}</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-display font-bold text-primary-dark mb-4">Descripción</h2>
            <p className="text-gray-soft-300 leading-relaxed whitespace-pre-wrap">{job.description}</p>
          </div>

          <Button variant="primary" fullWidth size="lg" onClick={handleApply}>
            Aplicar a este trabajo
          </Button>
        </div>
      </div>
    </div>
  )
}
