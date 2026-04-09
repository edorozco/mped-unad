import { useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useJobs } from '../../contexts/JobsContext'
import { useAuth } from '../../contexts/AuthContext'
import Header from '../../components/layout/Header'
import Navigation from '../../components/layout/Navigation'
import Button from '../../components/common/Button'
import SkillChip from '../../components/common/SkillChip'
import Modal from '../../components/common/Modal'
import Card from '../../components/common/Card'

const OfferDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { getJobById, applyToJob } = useJobs()
  const { user, isAuthenticated } = useAuth()
  const listingsPath = '/empleos'
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [applied, setApplied] = useState(false)

  const job = getJobById(id)

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-soft-50">
        <Header />
        <div className="container-custom py-12 text-center">
          <h2 className="text-2xl font-bold text-primary-dark mb-4">Oferta no encontrada</h2>
          <Button onClick={() => navigate('/empleos')}>Volver a ofertas</Button>
        </div>
      </div>
    )
  }

  const handleApply = () => {
    if (!isAuthenticated || !user) {
      navigate('/login', { state: { from: location.pathname } })
      return
    }
    applyToJob(job.id, user.id)
    setApplied(true)
    setShowConfirmation(true)
  }

  return (
    <div className="min-h-screen bg-gray-soft-50 pb-20 md:pb-0">
      <Header />
      <div className="container-custom py-6">
        <Button
          variant="ghost"
          onClick={() => navigate(listingsPath)}
          className="mb-4"
        >
          ← Volver
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">
            {/* Description */}
            <Card>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-20 h-20 bg-gray-soft-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {job.companyLogo ? (
                    <img src={job.companyLogo} alt={job.company} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl">🏢</span>
                  )}
                </div>
                <div>
                  <h1 className="text-3xl font-display font-bold text-primary-dark mb-2">
                    {job.title}
                  </h1>
                  <p className="text-lg text-gray-soft-200">{job.company}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold text-primary-dark mb-3">Descripción</h2>
                  <p className="text-gray-soft-200 leading-relaxed">{job.description}</p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-primary-dark mb-3">Requisitos</h2>
                  <div className="flex flex-wrap gap-2">
                    {job.requirements.map((req, idx) => (
                      <SkillChip key={idx} skill={req} variant="display" />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-soft-100">
                  <div>
                    <p className="text-sm text-gray-soft-200 mb-1">Duración</p>
                    <p className="font-semibold text-primary-dark">{job.duration}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-soft-200 mb-1">Horario</p>
                    <p className="font-semibold text-primary-dark">{job.schedule}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-soft-200 mb-1">Fecha de inicio</p>
                    <p className="font-semibold text-primary-dark">
                      {new Date(job.startDate).toLocaleDateString('es-ES', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-soft-200 mb-1">Pago</p>
                    <p className="font-semibold text-primary-dark">
                      ${job.payment.toLocaleString()} {job.paymentType}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Map */}
            <Card>
              <h2 className="text-xl font-semibold text-primary-dark mb-4">Ubicación</h2>
              <div className="bg-gray-soft-100 rounded-lg h-64 flex items-center justify-center mb-4">
                <div className="text-center">
                  <div className="text-4xl mb-2">📍</div>
                  <p className="text-primary-dark font-medium">{job.address}</p>
                  <p className="text-sm text-gray-soft-200 mt-1">{job.location}</p>
                </div>
              </div>
              <Button
                variant="outline"
                fullWidth
                onClick={() => {
                  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(job.address)}`
                  window.open(url, '_blank')
                }}
              >
                Ver en Google Maps
              </Button>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <Card className="lg:sticky lg:top-24">
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">💰</div>
                <p className="text-3xl font-bold text-primary-dark mb-1">
                  ${job.payment.toLocaleString()}
                </p>
                <p className="text-gray-soft-200">{job.paymentType}</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 text-sm">
                  <span>⏱️</span>
                  <span className="text-gray-soft-200">{job.duration}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span>📅</span>
                  <span className="text-gray-soft-200">{job.schedule}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span>👥</span>
                  <span className="text-gray-soft-200">{job.applicants} postulantes</span>
                </div>
              </div>

              <Button
                variant="primary"
                fullWidth
                size="lg"
                onClick={handleApply}
                disabled={applied}
              >
                {applied ? 'Ya postulado' : isAuthenticated ? 'Postularme' : 'Iniciar sesión para postular'}
              </Button>
            </Card>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmation}
        onClose={() => {
          setShowConfirmation(false)
          navigate(listingsPath)
        }}
        title="Postulación enviada"
      >
        <div className="text-center py-6">
          <div className="text-6xl mb-6">✅</div>
          <p className="text-lg text-gray-soft-200 mb-6">
            Tu postulación ha sido enviada exitosamente. El empleador revisará tu perfil y te contactará pronto.
          </p>
          <Button
            variant="primary"
            fullWidth
            onClick={() => {
              setShowConfirmation(false)
              navigate(listingsPath)
            }}
          >
            Ver más ofertas
          </Button>
        </div>
      </Modal>

      <Navigation />
    </div>
  )
}

export default OfferDetail
