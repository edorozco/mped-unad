import { useState, useMemo } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useJobs } from '../../contexts/JobsContext'
import { useAuth } from '../../contexts/AuthContext'
import Header from '../../components/layout/Header'
import Sidebar from '../../components/layout/Sidebar'
import Navigation from '../../components/layout/Navigation'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import demoCredentials from '../../data/demoCredentials.json'

const MODALITY_ICONS = {
  Remoto: 'cloud',
  Híbrido: 'sync_alt',
  Presencial: 'group',
}

const OfferDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { jobs, getJobById, applyToJob, isJobSaved, toggleSaveJob } = useJobs()
  const { user, isAuthenticated } = useAuth()
  const showSidebar = isAuthenticated && user?.role === 'young'
  const listingsPath = '/empleos'
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [applied, setApplied] = useState(false)

  const job = getJobById(id)

  const relatedJobs = useMemo(() => {
    if (!job) return []
    const others = jobs.filter((j) => j.id !== job.id && j.status === 'active')
    const sameCategory = others.filter((j) => j.category === job.category)
    const rest = others.filter((j) => j.category !== job.category)
    return [...sameCategory, ...rest].slice(0, 3)
  }, [jobs, job])

  const relatedCredential = useMemo(() => {
    if (!job) return null
    return demoCredentials.find((c) => c.category === job.category) || null
  }, [job])

  const companyActiveJobs = useMemo(() => {
    if (!job) return 0
    return jobs.filter((j) => j.company === job.company && j.status === 'active').length
  }, [jobs, job])

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-soft-50">
        <Header />
        {showSidebar && <Sidebar />}
        <div className={`${showSidebar ? 'md:ml-64' : ''} container-custom py-12 text-center`}>
          <h2 className="text-2xl font-bold text-primary-dark mb-4">Oferta no encontrada</h2>
          <Button onClick={() => navigate(listingsPath)}>Volver a ofertas</Button>
        </div>
      </div>
    )
  }

  const saved = user ? isJobSaved(job.id, user.id) : false

  const handleApply = () => {
    if (!isAuthenticated || !user) {
      navigate('/login', { state: { from: location.pathname } })
      return
    }
    applyToJob(job.id, user.id)
    setApplied(true)
    setShowConfirmation(true)
  }

  const handleToggleSave = () => {
    if (!isAuthenticated || !user) {
      navigate('/login', { state: { from: location.pathname } })
      return
    }
    toggleSaveJob(job.id, user.id)
  }

  return (
    <div className="min-h-screen bg-gray-soft-50 pb-20 md:pb-0">
      <Header />
      {showSidebar && <Sidebar />}
      <div className={showSidebar ? 'md:ml-64' : ''}>
        <div className="container-custom py-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-6 text-sm text-gray-soft-300">
            <button type="button" onClick={() => navigate(listingsPath)} className="hover:text-primary-cyan">
              Empleos
            </button>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
            <span className="text-primary-dark font-semibold">Detalle de Oferta</span>
          </nav>

          {/* Hero */}
          <section className="bg-white border border-gray-soft-200 rounded-xl p-6 md:p-8 mb-6 relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="flex gap-6 items-start">
                <div className="w-20 h-20 rounded-lg bg-gray-soft-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {job.companyLogo ? (
                    <img src={job.companyLogo} alt={job.company} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl">🏢</span>
                  )}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="bg-primary-cyan/15 text-primary-dark px-3 py-1 rounded-full text-xs font-semibold">
                      {job.category}
                    </span>
                    {job.isFeatured && (
                      <span className="bg-accent-gold/15 text-accent-gold px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">bolt</span> Urgente
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl md:text-3xl font-display font-bold text-primary-dark mb-1">{job.title}</h1>
                  <p className="text-gray-soft-300 flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">store</span>
                    {job.company}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-3 min-w-[200px]">
                <Button variant="primary" size="lg" onClick={handleApply} disabled={applied}>
                  {applied ? 'Ya postulado' : 'Postularme Ahora'}
                </Button>
                <Button variant="outline" onClick={handleToggleSave}>
                  <span className="flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-lg">{saved ? 'bookmark' : 'bookmark_border'}</span>
                    {saved ? 'Guardado' : 'Guardar para luego'}
                  </span>
                </Button>
              </div>
            </div>
          </section>

          {/* Main grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left column */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {/* Quick stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-soft-200 flex flex-col gap-1">
                  <span className="material-symbols-outlined text-primary-cyan">payments</span>
                  <p className="text-xs text-gray-soft-300">Remuneración</p>
                  <p className="text-lg font-display font-bold text-primary-dark">
                    ${job.payment.toLocaleString()} <span className="text-xs font-normal">{job.paymentType}</span>
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-soft-200 flex flex-col gap-1">
                  <span className="material-symbols-outlined text-primary-cyan">location_on</span>
                  <p className="text-xs text-gray-soft-300">Ubicación</p>
                  <p className="text-lg font-display font-bold text-primary-dark">{job.location}</p>
                  <p className="text-xs text-gray-soft-300 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">{MODALITY_ICONS[job.modality] || 'group'}</span>
                    {job.modality}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-soft-200 flex flex-col gap-1">
                  <span className="material-symbols-outlined text-primary-cyan">calendar_today</span>
                  <p className="text-xs text-gray-soft-300">Horario</p>
                  <p className="text-lg font-display font-bold text-primary-dark">{job.scheduleType}</p>
                  <p className="text-xs text-gray-soft-300">{job.duration}</p>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white border border-gray-soft-200 rounded-xl p-6 md:p-8">
                <h2 className="text-xl font-display font-bold text-primary-dark mb-4">Descripción del Puesto</h2>
                <p className="text-gray-soft-300 leading-relaxed mb-4">{job.description}</p>
                <p className="text-sm text-gray-soft-300 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">schedule</span>
                  {job.schedule}
                </p>
              </div>

              {/* Requirements & credential */}
              <div className="bg-white border border-gray-soft-200 rounded-xl p-6 md:p-8">
                <div className="flex justify-between items-start mb-6 flex-wrap gap-3">
                  <h2 className="text-xl font-display font-bold text-primary-dark">Requisitos y Habilidades</h2>
                  {relatedCredential && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-primary-cyan/10 border border-primary-cyan/30 rounded-lg">
                      <span className="material-symbols-outlined text-primary-cyan text-lg">military_tech</span>
                      <span className="text-xs font-semibold text-primary-dark">Otorga Credencial</span>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xs font-semibold text-primary-dark uppercase tracking-wider mb-4">
                      Habilidades requeridas
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {job.requirements.map((req) => (
                        <span
                          key={req}
                          className="px-3 py-1 bg-gray-soft-100 rounded border border-gray-soft-200 text-xs text-primary-dark"
                        >
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                  {relatedCredential && (
                    <div>
                      <h3 className="text-xs font-semibold text-primary-dark uppercase tracking-wider mb-4">
                        Certificación asociada
                      </h3>
                      <button
                        type="button"
                        onClick={() => navigate('/credentials')}
                        className="w-full flex gap-4 items-center p-4 bg-primary-dark/5 rounded-lg border border-primary-dark/10 hover:border-primary-cyan transition-colors text-left"
                      >
                        <div className="w-12 h-12 rounded-full bg-primary-dark flex items-center justify-center text-2xl flex-shrink-0">
                          {relatedCredential.icon}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-primary-dark">{relatedCredential.name}</p>
                          <p className="text-xs text-gray-soft-300">Validado por MPED</p>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              {/* Company card */}
              <div className="bg-white border border-gray-soft-200 rounded-xl overflow-hidden">
                <div className="h-16 bg-primary-dark" />
                <div className="p-6 -mt-10 relative text-center">
                  <div className="w-16 h-16 bg-white rounded-xl shadow-md mx-auto mb-4 border border-gray-soft-200 flex items-center justify-center overflow-hidden">
                    {job.companyLogo ? (
                      <img src={job.companyLogo} alt={job.company} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl">🏢</span>
                    )}
                  </div>
                  <h2 className="text-lg font-display font-bold text-primary-dark mb-1">{job.company}</h2>
                  <p className="text-xs text-gray-soft-300 mb-4">
                    {companyActiveJobs} {companyActiveJobs === 1 ? 'oferta activa' : 'ofertas activas'} en MPED
                  </p>
                </div>
              </div>

              {/* Related jobs */}
              {relatedJobs.length > 0 && (
                <div className="bg-white border border-gray-soft-200 rounded-xl p-6">
                  <h3 className="text-xs font-semibold text-primary-dark uppercase tracking-wider mb-4">
                    Ofertas Similares
                  </h3>
                  <div className="flex flex-col gap-3">
                    {relatedJobs.map((rj) => (
                      <button
                        key={rj.id}
                        type="button"
                        onClick={() => navigate(`/offer/${rj.id}`)}
                        className="p-3 border border-gray-soft-200 rounded-lg hover:border-primary-cyan transition-colors text-left group"
                      >
                        <div className="flex justify-between items-start mb-1 gap-2">
                          <h4 className="text-sm font-medium text-primary-dark group-hover:text-primary-cyan transition-colors">
                            {rj.title}
                          </h4>
                          <span className="text-primary-cyan font-bold text-xs flex-shrink-0">
                            ${rj.payment.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-soft-300">
                          <span className="material-symbols-outlined text-sm">location_on</span>
                          <span className="text-xs">{rj.company}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate(listingsPath)}
                    className="w-full mt-4 py-2 text-xs font-semibold text-gray-soft-300 hover:text-primary-cyan transition-colors underline"
                  >
                    Explorar más empleos
                  </button>
                </div>
              )}

              {/* Trust banner */}
              <div className="bg-primary-dark p-6 rounded-xl text-white">
                <span className="material-symbols-outlined text-primary-cyan mb-3">verified_user</span>
                <h4 className="text-sm font-bold mb-2">Postulación Protegida</h4>
                <p className="text-xs opacity-80 leading-snug">
                  Tus datos están seguros. El pago está garantizado por la plataforma MPED mediante el sistema de
                  validación de tareas.
                </p>
              </div>
            </div>
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
          <p className="text-lg text-gray-soft-300 mb-6">
            Tu postulación ha sido enviada exitosamente. El empleador revisará tu perfil y te contactará pronto.
          </p>
          <Button variant="primary" fullWidth onClick={() => navigate('/postulaciones')}>
            Ver mis postulaciones
          </Button>
        </div>
      </Modal>

      <Navigation />
    </div>
  )
}

export default OfferDetail
