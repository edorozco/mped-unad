import { Link } from 'react-router-dom'
import { useJobs } from '../../contexts/JobsContext'
import Header from '../../components/layout/Header'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'

const EmployerDashboard = () => {
  const { jobs, applications } = useJobs()

  const activeJobs = jobs.filter(j => j.status === 'active')
  const totalApplicants = applications.length
  const completedJobs = jobs.filter(j => j.status === 'completed').length

  return (
    <div className="min-h-screen bg-gray-soft-50">
      <Header />
      <div className="container-custom py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-display font-bold text-primary-dark">
            Panel de Empleador
          </h1>
          <Link to="/employer/create-job">
            <Button variant="primary">
              + Crear Oferta
            </Button>
          </Link>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#333] mb-1">Ofertas Activas</p>
                <p className="text-3xl font-bold text-primary-dark">{activeJobs.length}</p>
              </div>
              <div className="text-4xl">💼</div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#333] mb-1">Postulantes Totales</p>
                <p className="text-3xl font-bold text-primary-dark">{totalApplicants}</p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#333] mb-1">Trabajos Completados</p>
                <p className="text-3xl font-bold text-primary-dark">{completedJobs}</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </Card>
        </div>

        {/* Jobs List */}
        <Card>
          <h2 className="text-xl font-display font-bold text-primary-dark mb-6">
            Mis Ofertas
          </h2>

          {activeJobs.length > 0 ? (
            <div className="space-y-4">
              {activeJobs.map(job => (
                <div
                  key={job.id}
                  className="border border-[#333]/20 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-primary-dark mb-2">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap gap-4 text-sm text-[#333] mb-3">
                        <span>📍 {job.location}</span>
                        <span>💰 ${job.payment.toLocaleString()} {job.paymentType}</span>
                        <span>👥 {job.applicants} postulantes</span>
                      </div>
                      <p className="text-sm text-[#333]">{job.description.substring(0, 100)}...</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Link to={`/work/${job.id}/applicants`}>
                        <Button variant="outline" size="sm">
                          Ver postulantes
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-primary-dark mb-2">
                No tienes ofertas activas
              </h3>
              <p className="text-[#333] mb-6">
                Crea tu primera oferta para comenzar a recibir postulantes
              </p>
              <Link to="/employer/create-job">
                <Button variant="primary">
                  Crear primera oferta
                </Button>
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

export default EmployerDashboard
