import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useJobs } from '../../contexts/JobsContext'
import Header from '../../components/layout/Header'
import EmployerSidebar from '../../components/layout/EmployerSidebar'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import SkillChip from '../../components/common/SkillChip'
import demoApplicants from '../../data/demoApplicants.json'

const Applicants = () => {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const { getJobById, getApplicationsByJob, updateApplicationStatus } = useJobs()
  const [confirmed, setConfirmed] = useState(false)

  const job = getJobById(jobId)
  const applications = getApplicationsByJob(jobId)

  /** 5 postulantes mock; `applicationId` usa postulaciones reales del contexto si hay */
  const applicants = demoApplicants.map((row, index) => ({
    ...row,
    applicationId: applications[index]?.id ?? row.id,
  }))

  const handleConfirm = (applicant) => {
    // Update application status if it exists
    if (applicant.applicationId) {
      updateApplicationStatus(applicant.applicationId, 'confirmed')
    }
    setConfirmed(true)
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-soft-50">
        <Header />
        <EmployerSidebar />
        <div className="md:ml-64 container-custom py-12 text-center">
          <h2 className="text-2xl font-bold text-primary-dark mb-4">Oferta no encontrada</h2>
          <Button onClick={() => navigate('/employer/dashboard')}>Volver al panel</Button>
        </div>
      </div>
    )
  }

  if (confirmed) {
    return (
      <div className="min-h-screen bg-gray-soft-50">
        <Header />
        <EmployerSidebar />
        <div className="md:ml-64 container-custom py-12">
          <Card>
            <div className="text-center py-12">
              <div className="text-6xl mb-6">✅</div>
              <h2 className="text-2xl font-display font-bold text-primary-dark mb-4">
                Candidatos confirmados
              </h2>
              <p className="text-gray-soft-200 mb-8">
                Los candidatos seleccionados han sido notificados. Podrás gestionar la asistencia cuando comience el trabajo.
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    setConfirmed(false)
                    navigate(`/work/${jobId}/applicants`)
                  }}
                >
                  Ver lista
                </Button>
                <Button
                  variant="primary"
                  onClick={() => navigate('/employer/dashboard')}
                >
                  Volver al panel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-soft-50">
      <Header />
      <EmployerSidebar />
      <div className="md:ml-64 container-custom py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/employer/dashboard')}
          className="mb-6"
        >
          ← Volver al panel
        </Button>

        <Card className="mb-6">
          <h1 className="text-2xl font-display font-bold text-primary-dark mb-2">
            {job.title}
          </h1>
          <p className="text-[#333]">
            {applicants.length} {applicants.length === 1 ? 'postulante' : 'postulantes'}
          </p>
        </Card>

        <div className="space-y-4">
          {applicants.length > 0 ? (
            applicants.map(applicant => (
              <Card key={applicant.id}>
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 bg-gray-soft-100 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {applicant.photo ? (
                      <img src={applicant.photo} alt={applicant.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl">👤</span>
                    )}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-primary-dark mb-1">
                          {applicant.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-[#333] mb-1">
                          <span>⭐ {applicant.rating}</span>
                          <span>•</span>
                          <span>
                            Postuló el {new Date(applicant.appliedAt).toLocaleDateString('es-ES')}
                          </span>
                        </div>
                        <div className="text-xs text-[#333]">
                          📧 {applicant.email} • 📱 {applicant.phone}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {applicant.skills.map((skill, idx) => (
                        <SkillChip key={idx} skill={skill} variant="display" />
                      ))}
                    </div>

                    <div className="flex gap-3 flex-wrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/work/${jobId}/candidate/${applicant.id}`)}
                      >
                        Ver perfil
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleConfirm(applicant)}
                      >
                        Confirmar candidato
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card>
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl font-semibold text-primary-dark mb-2">
                  No hay postulantes aún
                </h3>
                <p className="text-gray-soft-200">
                  Los postulantes aparecerán aquí cuando se postulen a esta oferta.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default Applicants
