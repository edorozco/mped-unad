import { useParams, useNavigate } from 'react-router-dom'
import { useMemo } from 'react'
import Header from '../../components/layout/Header'
import EmployerSidebar from '../../components/layout/EmployerSidebar'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import SkillChip from '../../components/common/SkillChip'
import StarRating from '../../components/common/StarRating'
import demoApplicants from '../../data/demoApplicants.json'

const ApplicantProfile = () => {
  const { jobId, applicantId } = useParams()
  const navigate = useNavigate()

  const applicant = useMemo(() => {
    const id = parseInt(applicantId, 10)
    return demoApplicants.find((a) => a.id === id) ?? null
  }, [applicantId])

  if (!applicant) {
    return (
      <div className="min-h-screen bg-gray-soft-50">
        <Header />
        <EmployerSidebar />
        <div className="md:ml-64 container-custom py-12 text-center">
          <h2 className="text-2xl font-bold text-primary-dark mb-4">Perfil no encontrado</h2>
          <Button variant="primary" onClick={() => navigate(`/work/${jobId}/applicants`)}>
            Volver a postulantes
          </Button>
        </div>
      </div>
    )
  }

  const backHref = `/work/${jobId}/applicants`

  return (
    <div className="min-h-screen bg-gray-soft-50 pb-10">
      <Header />
      <EmployerSidebar />
      <div className="md:ml-64 container-custom py-8 max-w-3xl">
        <Button variant="ghost" className="mb-8 px-0 sm:px-4 self-start" onClick={() => navigate(backHref)}>
          ← Volver a postulantes
        </Button>

        <Card className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start gap-6">
            <div className="w-28 h-28 bg-gray-soft-100 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden mx-auto sm:mx-0 ring-2 ring-gray-soft-200">
              {applicant.photo ? (
                <img src={applicant.photo} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-5xl">👤</span>
              )}
            </div>
            <div className="flex-grow text-center sm:text-left">
              <h1 className="text-2xl md:text-3xl font-display font-bold text-primary-dark mb-2">
                {applicant.name}
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 justify-center sm:justify-start">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <StarRating rating={Math.min(5, Math.max(0, Math.floor(applicant.rating)))} size="md" />
                  <span className="text-sm font-semibold text-[#333]">{applicant.rating.toFixed(1)}</span>
                  <span className="text-sm text-[#333]">promedio</span>
                </div>
              </div>
              <div className="space-y-1 text-sm text-[#333]">
                <p>
                  <span className="font-medium">Correo:</span> {applicant.email}
                </p>
                <p>
                  <span className="font-medium">Teléfono:</span> {applicant.phone}
                </p>
                {applicant.city && (
                  <p>
                    <span className="font-medium">Ciudad:</span> {applicant.city}
                  </p>
                )}
                <p>
                  <span className="font-medium">Postuló el:</span>{' '}
                  {new Date(applicant.appliedAt).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {applicant.bio && (
          <Card className="mb-6">
            <h2 className="text-lg font-display font-semibold text-primary-dark mb-3">Sobre el candidato</h2>
            <p className="text-[#333] leading-relaxed whitespace-pre-line">{applicant.bio}</p>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {applicant.education && (
            <Card>
              <h2 className="text-lg font-display font-semibold text-primary-dark mb-2">Formación</h2>
              <p className="text-sm text-[#333]">{applicant.education}</p>
            </Card>
          )}
          {applicant.availabilitySummary && (
            <Card>
              <h2 className="text-lg font-display font-semibold text-primary-dark mb-2">Disponibilidad</h2>
              <p className="text-sm text-[#333]">{applicant.availabilitySummary}</p>
            </Card>
          )}
        </div>

        {applicant.interests?.length > 0 && (
          <Card className="mb-6">
            <h2 className="text-lg font-display font-semibold text-primary-dark mb-3">Intereses</h2>
            <div className="flex flex-wrap gap-2">
              {applicant.interests.map((item) => (
                <SkillChip key={item} skill={item} variant="display" />
              ))}
            </div>
          </Card>
        )}

        <Card className="mb-6">
          <h2 className="text-lg font-display font-semibold text-primary-dark mb-3">Habilidades</h2>
          <div className="flex flex-wrap gap-2">
            {applicant.skills.map((skill) => (
              <SkillChip key={skill} skill={skill} variant="display" />
            ))}
          </div>
        </Card>

        {(applicant.completedMicrojobs != null || (applicant.languages && applicant.languages.length > 0)) && (
          <Card className="mb-8">
            <h2 className="text-lg font-display font-semibold text-primary-dark mb-4">Experiencia en la plataforma</h2>
            <ul className="space-y-2 text-sm text-[#333]">
              {applicant.completedMicrojobs != null && (
                <li>
                  <span className="font-medium">Microempleos completados:</span> {applicant.completedMicrojobs}
                </li>
              )}
              {applicant.languages && applicant.languages.length > 0 && (
                <li>
                  <span className="font-medium">Idiomas:</span> {applicant.languages.join(' · ')}
                </li>
              )}
            </ul>
          </Card>
        )}

        {applicant.credentials?.length > 0 && (
          <Card className="mb-8">
            <h2 className="text-lg font-display font-semibold text-primary-dark mb-3">Credenciales</h2>
            <ul className="space-y-2">
              {applicant.credentials.map((c) => (
                <li
                  key={c}
                  className="flex items-center gap-2 text-sm text-[#333] border border-gray-soft-200 rounded-lg px-3 py-2 bg-gray-soft-50"
                >
                  <span className="text-primary-cyan" aria-hidden>
                    ✓
                  </span>
                  {c}
                </li>
              ))}
            </ul>
          </Card>
        )}

        <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
          <Button variant="outline" onClick={() => navigate(backHref)}>
            Volver a la lista
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ApplicantProfile
