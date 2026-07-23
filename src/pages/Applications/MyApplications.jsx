import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useJobs } from '../../contexts/JobsContext'
import Header from '../../components/layout/Header'
import Sidebar from '../../components/layout/Sidebar'
import Navigation from '../../components/layout/Navigation'
import Button from '../../components/common/Button'

const STATUS_META = {
  pending: { label: 'En Revisión', className: 'bg-primary-cyan/15 text-primary-dark', icon: 'sync_alt' },
  confirmed: { label: 'Seleccionado', className: 'bg-primary-cyan/25 text-primary-dark', icon: 'check_circle' },
  rejected: { label: 'No Seleccionado', className: 'bg-gray-soft-100 text-gray-soft-300', icon: 'cancel' },
}

const STATUS_FILTERS = [
  { value: '', label: 'Estado: Todos' },
  { value: 'pending', label: 'En Revisión' },
  { value: 'confirmed', label: 'Seleccionado' },
  { value: 'rejected', label: 'No Seleccionado' },
]

const MyApplications = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { getUserApplications, getJobById } = useJobs()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sortBy, setSortBy] = useState('recent')

  const applications = user ? getUserApplications(user.id) : []
  const allRows = applications.map((app) => ({ app, job: getJobById(app.jobId) })).filter((row) => row.job)

  const total = allRows.length
  const enProceso = allRows.filter((row) => row.app.status === 'pending').length
  const finalizadas = allRows.filter((row) => row.app.status !== 'pending').length

  const rows = useMemo(() => {
    let filtered = allRows
    if (statusFilter) {
      filtered = filtered.filter((row) => row.app.status === statusFilter)
    }
    if (search) {
      const q = search.toLowerCase()
      filtered = filtered.filter(
        (row) => row.job.title.toLowerCase().includes(q) || row.job.company.toLowerCase().includes(q)
      )
    }
    filtered = [...filtered].sort((a, b) =>
      sortBy === 'recent'
        ? new Date(b.app.appliedAt) - new Date(a.app.appliedAt)
        : new Date(a.app.appliedAt) - new Date(b.app.appliedAt)
    )
    return filtered
  }, [allRows, statusFilter, search, sortBy])

  return (
    <div className="min-h-screen bg-gray-soft-50 pb-20 md:pb-0">
      <Header />
      <Sidebar />
      <div className="md:ml-64">
        <div className="container-custom py-8">
          <header className="mb-8">
            <h1 className="text-2xl md:text-3xl font-display font-bold text-primary-dark mb-2">Mis Postulaciones</h1>
            <p className="text-gray-soft-300">Sigue el estado de tus aplicaciones a microempleos en tiempo real.</p>
          </header>

          {/* KPI cards */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white border border-gray-soft-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="material-symbols-outlined text-primary-dark p-2 bg-primary-cyan/15 rounded-lg">assignment</span>
              </div>
              <h3 className="text-xs font-bold text-gray-soft-300 uppercase tracking-wider">Total Postulaciones</h3>
              <p className="text-3xl font-display font-bold text-primary-dark mt-1">{total}</p>
            </div>
            <div className="bg-white border border-gray-soft-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="material-symbols-outlined text-primary-dark p-2 bg-primary-cyan/15 rounded-lg">sync_alt</span>
                <span className="text-gray-soft-300 text-xs font-semibold">En revisión</span>
              </div>
              <h3 className="text-xs font-bold text-gray-soft-300 uppercase tracking-wider">En Proceso</h3>
              <p className="text-3xl font-display font-bold text-primary-cyan mt-1">{enProceso}</p>
            </div>
            <div className="bg-white border border-gray-soft-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="material-symbols-outlined text-accent-gold p-2 bg-accent-gold/15 rounded-lg">check_circle</span>
                <span className="text-gray-soft-300 text-xs font-semibold">Cerradas</span>
              </div>
              <h3 className="text-xs font-bold text-gray-soft-300 uppercase tracking-wider">Finalizadas</h3>
              <p className="text-3xl font-display font-bold text-primary-dark mt-1">{finalizadas}</p>
            </div>
          </section>

          {/* Filters */}
          <section className="bg-white border border-gray-soft-200 rounded-xl p-4 mb-6 flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative w-full lg:flex-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-soft-300">
                search
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por puesto o empresa..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-soft-200 focus:ring-2 focus:ring-primary-cyan focus:border-transparent outline-none transition-all"
              />
            </div>
            <div className="flex flex-wrap gap-2 w-full lg:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 rounded-lg border border-gray-soft-200 bg-white text-sm font-medium focus:ring-2 focus:ring-primary-cyan outline-none cursor-pointer"
              >
                {STATUS_FILTERS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2.5 rounded-lg border border-gray-soft-200 bg-white text-sm font-medium focus:ring-2 focus:ring-primary-cyan outline-none cursor-pointer"
              >
                <option value="recent">Ordenar por: Fecha Reciente</option>
                <option value="oldest">Ordenar por: Fecha Antigua</option>
              </select>
            </div>
          </section>

          {/* Applications table */}
          {rows.length > 0 ? (
            <div className="bg-white border border-gray-soft-200 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-gray-soft-50 border-b border-gray-soft-200 hidden md:table-header-group">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-soft-300 uppercase tracking-wide">
                        Puesto & Empresa
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-soft-300 uppercase tracking-wide">
                        Fecha Postulación
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-soft-300 uppercase tracking-wide">
                        Estado
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-gray-soft-300 uppercase tracking-wide">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-soft-200">
                    {rows.map(({ app, job }) => {
                      const status = STATUS_META[app.status] || STATUS_META.pending
                      return (
                        <tr key={app.id} className="hover:bg-gray-soft-50 transition-colors">
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-lg bg-gray-soft-100 flex items-center justify-center flex-shrink-0 overflow-hidden border border-gray-soft-200">
                                {job.companyLogo ? (
                                  <img src={job.companyLogo} alt={job.company} className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-xl">🏢</span>
                                )}
                              </div>
                              <div>
                                <div className="font-semibold text-primary-dark">{job.title}</div>
                                <div className="text-sm text-gray-soft-300">{job.company}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-sm text-gray-soft-300">
                            {new Date(app.appliedAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="px-6 py-5">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${status.className}`}>
                              <span className="material-symbols-outlined text-sm mr-1">{status.icon}</span>
                              {status.label}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <button
                              type="button"
                              onClick={() => navigate(`/offer/${job.id}`)}
                              className="text-primary-cyan font-semibold text-sm hover:underline"
                            >
                              Ver Detalle
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : allRows.length > 0 ? (
            <div className="bg-white border border-dashed border-gray-soft-200 rounded-xl p-12 text-center">
              <p className="text-gray-soft-300 italic">
                ¿No encuentras lo que buscas? Intenta ajustar tus filtros o explora nuevas oportunidades.
              </p>
            </div>
          ) : (
            <div className="bg-white border border-dashed border-gray-soft-200 rounded-xl p-12 text-center">
              <span className="material-symbols-outlined text-5xl text-gray-soft-300 mb-4">assignment</span>
              <h3 className="text-lg font-display font-bold text-primary-dark mb-2">Aún no tienes postulaciones</h3>
              <p className="text-gray-soft-300 mb-6">
                Explora microempleos y postúlate para comenzar a construir tu experiencia.
              </p>
              <Button variant="primary" onClick={() => navigate('/empleos')}>
                Explorar microempleos
              </Button>
            </div>
          )}
        </div>
      </div>
      <Navigation />
    </div>
  )
}

export default MyApplications
