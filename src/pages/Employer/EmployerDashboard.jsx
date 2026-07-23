import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useJobs } from '../../contexts/JobsContext'
import Header from '../../components/layout/Header'
import EmployerSidebar from '../../components/layout/EmployerSidebar'
import Button from '../../components/common/Button'
import demoApplicants from '../../data/demoApplicants.json'

const EmployerDashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { jobs, applications } = useJobs()

  const activeJobs = jobs.filter((j) => j.status === 'active')
  const pendingReview = applications.filter((a) => a.status === 'pending').length
  const finalized = applications.filter((a) => a.status !== 'pending').length

  const topJobs = useMemo(() => {
    const max = Math.max(...jobs.map((j) => j.applicants), 1)
    return [...jobs]
      .sort((a, b) => b.applicants - a.applicants)
      .slice(0, 3)
      .map((j) => ({ ...j, percent: Math.round((j.applicants / max) * 100) }))
  }, [jobs])

  const recentApplicants = useMemo(
    () => [...demoApplicants].sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt)).slice(0, 5),
    []
  )

  const profileChecks = [!!user?.businessName, !!user?.nit, !!user?.city, !!user?.email]
  const profilePercent = Math.round((profileChecks.filter(Boolean).length / profileChecks.length) * 100)

  const firstActiveJobId = activeJobs[0]?.id

  return (
    <div className="min-h-screen bg-gray-soft-50 flex flex-col">
      <Header />
      <EmployerSidebar />

      <div className="md:ml-64 flex-1">
      <div className="container-custom py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-primary-dark">Panel de Empresa</h1>
            <p className="text-gray-soft-300">{user?.businessName || user?.name}</p>
          </div>
          <Button variant="primary" onClick={() => navigate('/employer/create-job')}>
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">add_circle</span>
              Nueva Oferta
            </span>
          </Button>
        </div>

        {/* KPI bento grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-gray-soft-200 rounded-xl p-6">
            <div className="flex justify-between items-start mb-4">
              <span className="material-symbols-outlined text-primary-dark bg-primary-cyan/15 p-2 rounded-lg">campaign</span>
              <span className="text-xs font-bold text-gray-soft-300">Activas</span>
            </div>
            <p className="text-3xl font-display font-bold text-primary-dark">{activeJobs.length}</p>
            <p className="text-sm text-gray-soft-300">ofertas activas</p>
          </div>
          <div className="bg-white border border-gray-soft-200 rounded-xl p-6">
            <div className="flex justify-between items-start mb-4">
              <span className="material-symbols-outlined text-primary-dark bg-primary-cyan/15 p-2 rounded-lg">description</span>
              <span className="text-xs font-bold text-gray-soft-300">Actualizado</span>
            </div>
            <p className="text-3xl font-display font-bold text-primary-dark">{applications.length}</p>
            <p className="text-sm text-gray-soft-300">postulaciones recibidas</p>
          </div>
          <div className="bg-white border border-gray-soft-200 rounded-xl p-6">
            <div className="flex justify-between items-start mb-4">
              <span className="material-symbols-outlined text-accent-gold bg-accent-gold/15 p-2 rounded-lg">fact_check</span>
              <span className="text-xs font-bold text-gray-soft-300">Pendiente</span>
            </div>
            <p className="text-3xl font-display font-bold text-primary-dark">{pendingReview}</p>
            <p className="text-sm text-gray-soft-300">candidatos en revisión</p>
          </div>
          <div className="bg-white border border-gray-soft-200 rounded-xl p-6">
            <div className="flex justify-between items-start mb-4">
              <span className="material-symbols-outlined text-gray-soft-300 bg-gray-soft-100 p-2 rounded-lg">check_circle</span>
              <span className="text-xs font-bold text-gray-soft-300">Histórico</span>
            </div>
            <p className="text-3xl font-display font-bold text-primary-dark">{finalized}</p>
            <p className="text-sm text-gray-soft-300">procesos finalizados</p>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Recent applicants table */}
          <div className="lg:col-span-2 bg-white border border-gray-soft-200 rounded-xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-soft-200 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-display font-bold text-primary-dark">Postulantes Recientes</h2>
                <p className="text-sm text-gray-soft-300">Candidatos con mejores coincidencias de habilidades.</p>
              </div>
              {firstActiveJobId && (
                <button
                  type="button"
                  onClick={() => navigate(`/work/${firstActiveJobId}/applicants`)}
                  className="text-sm font-semibold text-primary-cyan hover:underline flex-shrink-0"
                >
                  Ver todos
                </button>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-soft-50 border-b border-gray-soft-200">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-gray-soft-300 uppercase tracking-wider">Candidato</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-soft-300 uppercase tracking-wider">Habilidades Clave</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-soft-300 uppercase tracking-wider text-center">
                      Credenciales
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-soft-300 uppercase tracking-wider text-right">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-soft-200">
                  {recentApplicants.map((applicant) => (
                    <tr key={applicant.id} className="hover:bg-gray-soft-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-soft-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {applicant.photo ? (
                              <img src={applicant.photo} alt={applicant.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="material-symbols-outlined text-primary-dark">person</span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium text-primary-dark truncate">{applicant.name}</div>
                            <div className="text-xs text-gray-soft-300">
                              {applicant.city} · ⭐ {applicant.rating}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {applicant.skills.slice(0, 2).map((skill) => (
                            <span key={skill} className="bg-primary-cyan/15 text-primary-dark px-2 py-0.5 rounded text-[11px] font-bold">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-1">
                          {applicant.credentials.slice(0, 2).map((cred) => (
                            <div
                              key={cred}
                              title={cred}
                              className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-dark to-primary-cyan flex items-center justify-center text-white shadow-sm"
                            >
                              <span className="material-symbols-outlined text-[14px]">verified</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {firstActiveJobId ? (
                          <button
                            type="button"
                            onClick={() => navigate(`/work/${firstActiveJobId}/candidate/${applicant.id}`)}
                            className="text-primary-cyan hover:bg-primary-cyan/10 p-2 rounded-full transition-colors"
                          >
                            <span className="material-symbols-outlined">visibility</span>
                          </button>
                        ) : (
                          <span className="text-gray-soft-300">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right widgets */}
          <div className="flex flex-col gap-6">
            <div className="bg-primary-dark text-white p-6 rounded-xl relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-lg font-display font-bold mb-2">Completitud del Perfil</h3>
                <p className="text-sm opacity-80 mb-6">Mejora tu visibilidad completando los datos de tu empresa.</p>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">{profilePercent}%</span>
                </div>
                <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden mb-8">
                  <div className="bg-primary-cyan h-full transition-all duration-700" style={{ width: `${profilePercent}%` }} />
                </div>
                <Button variant="outlineLight" fullWidth onClick={() => navigate('/employer/create-job')}>
                  Actualizar perfil
                </Button>
              </div>
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-primary-cyan/10 rounded-full blur-3xl" />
            </div>

            <div className="bg-white border border-gray-soft-200 rounded-xl p-6">
              <h3 className="font-semibold text-primary-dark mb-4">Ofertas más activas</h3>
              {topJobs.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {topJobs.map((job) => (
                    <div key={job.id} className="flex flex-col gap-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-primary-dark truncate">{job.title}</span>
                        <span className="text-primary-dark font-bold flex-shrink-0 ml-2">{job.applicants} postulantes</span>
                      </div>
                      <div className="w-full bg-gray-soft-100 h-1 rounded-full">
                        <div className="bg-primary-cyan h-full rounded-full" style={{ width: `${job.percent}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-soft-300">Aún no hay ofertas publicadas.</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick tips */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-soft-100 p-6 rounded-xl flex items-center gap-6">
            <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center text-primary-dark shadow-sm flex-shrink-0">
              <span className="material-symbols-outlined text-3xl">lightbulb</span>
            </div>
            <div>
              <h4 className="font-display font-bold text-primary-dark">Consejo de Contratación</h4>
              <p className="text-sm text-gray-soft-300">
                Las credenciales aseguran que el candidato posee las habilidades básicas necesarias para el puesto.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/cursos')}
            className="bg-accent-gold/15 text-primary-dark p-6 rounded-xl flex items-center gap-6 text-left hover:bg-accent-gold/25 transition-colors"
          >
            <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center text-primary-dark shadow-sm flex-shrink-0">
              <span className="material-symbols-outlined text-3xl">school</span>
            </div>
            <div>
              <h4 className="font-display font-bold text-primary-dark">Explorar cursos</h4>
              <p className="text-sm text-primary-dark/70">
                ¿Falta alguna habilidad en tus candidatos? Descubre los cursos disponibles en MPED.
              </p>
            </div>
          </button>
        </section>

        {/* Active offers list */}
        <div className="bg-white border border-gray-soft-200 rounded-xl p-6">
          <h2 className="text-lg font-display font-bold text-primary-dark mb-6">Mis Ofertas</h2>
          {activeJobs.length > 0 ? (
            <div className="space-y-4">
              {activeJobs.map((job) => (
                <div key={job.id} className="border border-gray-soft-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-primary-dark mb-2">{job.title}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-soft-300 mb-3">
                        <span>📍 {job.location}</span>
                        <span>💰 ${job.payment.toLocaleString()} {job.paymentType}</span>
                        <span>👥 {job.applicants} postulantes</span>
                      </div>
                      <p className="text-sm text-gray-soft-300">{job.description.substring(0, 100)}...</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => navigate(`/work/${job.id}/applicants`)}>
                      Ver postulantes
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <span className="material-symbols-outlined text-5xl text-gray-soft-300 mb-4">work_off</span>
              <h3 className="text-lg font-semibold text-primary-dark mb-2">No tienes ofertas activas</h3>
              <p className="text-gray-soft-300 mb-6">Crea tu primera oferta para comenzar a recibir postulantes.</p>
              <Button variant="primary" onClick={() => navigate('/employer/create-job')}>
                Crear primera oferta
              </Button>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  )
}

export default EmployerDashboard
