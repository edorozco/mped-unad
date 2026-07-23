import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useJobs } from '../../contexts/JobsContext'
import { useAuth } from '../../contexts/AuthContext'
import Header from '../../components/layout/Header'
import Sidebar from '../../components/layout/Sidebar'
import Navigation from '../../components/layout/Navigation'
import Input from '../../components/common/Input'

const CATEGORY_ICONS = {
  Ventas: 'sell',
  Marketing: 'campaign',
  Reparto: 'two_wheeler',
  Eventos: 'event',
  Fotografía: 'photo_camera',
  Educación: 'school',
}

const SCHEDULE_TYPES = ['Fines de Semana', 'Medio Tiempo', 'Por Horas', 'Nocturno']

const MODALITY_ICONS = {
  Remoto: 'cloud',
  Híbrido: 'sync_alt',
  Presencial: 'group',
}

function FilterPanel({ filters, setFilters, locations, categoryCounts, hasActiveFilters, onClear }) {
  const toggleLocation = (loc) => {
    setFilters((prev) => ({
      ...prev,
      locations: prev.locations.includes(loc) ? prev.locations.filter((l) => l !== loc) : [...prev.locations, loc],
    }))
  }

  const toggleScheduleType = (type) => {
    setFilters((prev) => ({
      ...prev,
      scheduleTypes: prev.scheduleTypes.includes(type)
        ? prev.scheduleTypes.filter((t) => t !== type)
        : [...prev.scheduleTypes, type],
    }))
  }

  const toggleCategory = (cat) => {
    setFilters((prev) => ({ ...prev, category: prev.category === cat ? '' : cat }))
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium text-gray-soft-300 block mb-3">Ubicación</label>
        <div className="flex flex-col gap-2">
          {locations.map((loc) => (
            <label key={loc} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.locations.includes(loc)}
                onChange={() => toggleLocation(loc)}
                className="w-4 h-4 rounded border-gray-soft-200 text-primary-cyan focus:ring-primary-cyan"
              />
              <span className="text-sm text-primary-dark">{loc}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-soft-300 block mb-3">Modalidad</label>
        <select
          value={filters.modality}
          onChange={(e) => setFilters((p) => ({ ...p, modality: e.target.value }))}
          className="w-full px-3 py-2 rounded-lg border-2 border-gray-soft-200 focus:outline-none focus:ring-2 focus:ring-primary-cyan"
        >
          <option value="">Todas las modalidades</option>
          <option value="Remoto">Remoto</option>
          <option value="Presencial">Presencial</option>
          <option value="Híbrido">Híbrido</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-soft-300 block mb-3">Horario</label>
        <div className="grid grid-cols-2 gap-2">
          {SCHEDULE_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => toggleScheduleType(type)}
              className={`px-3 py-2 rounded-lg border text-xs font-medium transition-colors ${
                filters.scheduleTypes.includes(type)
                  ? 'border-primary-cyan bg-primary-cyan/10 text-primary-dark'
                  : 'border-gray-soft-200 text-gray-soft-300 hover:border-primary-cyan'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-soft-300 block mb-3">Categoría</label>
        <div className="space-y-1">
          {Object.entries(categoryCounts).map(([cat, count]) => (
            <button
              key={cat}
              type="button"
              onClick={() => toggleCategory(cat)}
              className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors text-left ${
                filters.category === cat ? 'bg-primary-cyan/10' : 'hover:bg-gray-soft-50'
              }`}
            >
              <span className="flex items-center gap-2 text-sm text-primary-dark">
                <span className="material-symbols-outlined text-primary-dark text-lg">
                  {CATEGORY_ICONS[cat] || 'work'}
                </span>
                {cat}
              </span>
              <span className="text-xs text-gray-soft-300">{count}</span>
            </button>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={onClear}
          className="w-full py-2 text-sm font-semibold text-primary-cyan hover:underline"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  )
}

const YoungHome = () => {
  const navigate = useNavigate()
  const { jobs, filteredJobs, filterJobs } = useJobs()
  const { user, isAuthenticated } = useAuth()
  const showSidebar = isAuthenticated && user?.role === 'young'

  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    category: '',
    locations: [],
    modality: '',
    scheduleTypes: [],
    sortBy: 'recent',
  })

  useEffect(() => {
    filterJobs({ ...filters, search: searchQuery })
  }, [filters, searchQuery])

  const locations = useMemo(() => [...new Set(jobs.map((j) => j.location))], [jobs])
  const categoryCounts = useMemo(() => {
    const counts = {}
    jobs.forEach((j) => {
      counts[j.category] = (counts[j.category] || 0) + 1
    })
    return counts
  }, [jobs])

  const hasActiveFilters =
    !!filters.category || filters.locations.length > 0 || !!filters.modality || filters.scheduleTypes.length > 0

  const clearFilters = () => {
    setFilters((prev) => ({ category: '', locations: [], modality: '', scheduleTypes: [], sortBy: prev.sortBy }))
    setSearchQuery('')
  }

  return (
    <div className="min-h-screen bg-gray-soft-50 pb-20 md:pb-0">
      <Header />
      {showSidebar && <Sidebar />}
      <div className={showSidebar ? 'md:ml-64' : ''}>
        <div className="container-custom py-8 flex flex-col md:flex-row gap-8">
          {/* Filters aside (desktop) */}
          <aside className="hidden md:block w-72 flex-shrink-0">
            <div className="bg-white border border-gray-soft-200 rounded-xl p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-display font-bold text-primary-dark">Filtros</h2>
                <span className="material-symbols-outlined text-gray-soft-300">tune</span>
              </div>
              <FilterPanel
                filters={filters}
                setFilters={setFilters}
                locations={locations}
                categoryCounts={categoryCounts}
                hasActiveFilters={hasActiveFilters}
                onClear={clearFilters}
              />
            </div>
          </aside>

          {/* Main catalog */}
          <section className="flex-1 space-y-6 min-w-0">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-bold text-primary-dark mb-2 text-balance">
                  Empleos disponibles
                </h1>
                <p className="text-gray-soft-300 max-w-2xl">
                  Encuentra oportunidades flexibles diseñadas para jóvenes. Valida tus habilidades y comienza tu
                  trayectoria digital hoy mismo.
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-soft-300 flex-shrink-0">
                <span className="material-symbols-outlined">sort</span>
                <span>Ordenar por:</span>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters((p) => ({ ...p, sortBy: e.target.value }))}
                  className="bg-transparent border-none font-semibold text-primary-dark focus:ring-0 cursor-pointer"
                >
                  <option value="recent">Más recientes</option>
                  <option value="payment">Mayor remuneración</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-1 relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-soft-300">
                  search
                </span>
                <Input
                  type="text"
                  placeholder="Buscar trabajos, empresas, habilidades..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12"
                />
              </div>
            </div>

            <p className="text-sm text-gray-soft-300">
              {filteredJobs.length} {filteredJobs.length === 1 ? 'oferta encontrada' : 'ofertas encontradas'}
            </p>

            {filteredJobs.length > 0 ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {filteredJobs.map((job) => (
                  <button
                    key={job.id}
                    type="button"
                    onClick={() => navigate(`/offer/${job.id}`)}
                    className="text-left bg-white border border-gray-soft-200 rounded-xl p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col relative"
                  >
                    {job.isFeatured && (
                      <span className="absolute top-4 right-4 bg-primary-cyan/15 text-primary-dark px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">bolt</span> Urgente
                      </span>
                    )}
                    <div className="flex gap-4 mb-6">
                      <div className="w-14 h-14 rounded-lg bg-gray-soft-100 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-2xl text-primary-dark">
                          {CATEGORY_ICONS[job.category] || 'work'}
                        </span>
                      </div>
                      <div className="pr-16">
                        <h3 className="text-lg font-display font-bold text-primary-dark mb-1">{job.title}</h3>
                        <p className="text-sm text-gray-soft-300">{job.company}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="bg-gray-soft-100 text-gray-soft-300 px-3 py-1 rounded-lg text-xs flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">location_on</span> {job.location}
                      </span>
                      <span className="bg-gray-soft-100 text-gray-soft-300 px-3 py-1 rounded-lg text-xs flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">event</span> {job.scheduleType}
                      </span>
                      <span className="bg-gray-soft-100 text-gray-soft-300 px-3 py-1 rounded-lg text-xs flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">
                          {MODALITY_ICONS[job.modality] || 'group'}
                        </span>{' '}
                        {job.modality}
                      </span>
                    </div>
                    <div className="mt-auto pt-4 border-t border-gray-soft-200 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-soft-300">Pago {job.paymentType}</p>
                        <p className="font-display font-bold text-primary-cyan">${job.payment.toLocaleString()}</p>
                      </div>
                      <span className="bg-primary-dark text-white px-5 py-2.5 rounded-lg text-sm font-semibold">
                        Ver oferta
                      </span>
                    </div>
                  </button>
                ))}

                {/* Promo card */}
                <div className="bg-primary-dark text-white rounded-xl p-8 flex flex-col items-center justify-center text-center">
                  <span className="material-symbols-outlined text-4xl mb-4 text-primary-cyan">workspace_premium</span>
                  <h3 className="text-xl font-display font-bold mb-3">¿Quieres destacar más?</h3>
                  <p className="text-sm opacity-90 mb-6 max-w-xs">
                    Obtén credenciales para aumentar tus posibilidades de ser contratado.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate('/cursos')}
                    className="bg-primary-cyan text-white px-6 py-3 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
                  >
                    Explorar cursos
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-primary-dark mb-2">No se encontraron ofertas</h3>
                <p className="text-gray-soft-300 mb-6">Intenta ajustar tus filtros de búsqueda</p>
                <button type="button" onClick={clearFilters} className="text-primary-cyan font-semibold hover:underline">
                  Limpiar búsqueda
                </button>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Mobile filters FAB + overlay */}
      <button
        type="button"
        onClick={() => setShowFilters(true)}
        className="md:hidden fixed bottom-24 right-6 w-14 h-14 bg-primary-dark text-white rounded-full shadow-lg flex items-center justify-center z-40 active:scale-90 transition-transform"
        aria-label="Abrir filtros"
      >
        <span className="material-symbols-outlined">filter_list</span>
      </button>

      {showFilters && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-50 flex items-end"
          onClick={() => setShowFilters(false)}
        >
          <div
            className="bg-white rounded-t-2xl w-full max-h-[85vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-display font-bold text-primary-dark">Filtros</h2>
              <button type="button" onClick={() => setShowFilters(false)} className="text-gray-soft-300">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <FilterPanel
              filters={filters}
              setFilters={setFilters}
              locations={locations}
              categoryCounts={categoryCounts}
              hasActiveFilters={hasActiveFilters}
              onClear={clearFilters}
            />
            <button
              type="button"
              onClick={() => setShowFilters(false)}
              className="w-full mt-6 py-3 bg-primary-dark text-white rounded-lg font-semibold"
            >
              Ver resultados ({filteredJobs.length})
            </button>
          </div>
        </div>
      )}

      <Navigation />
    </div>
  )
}

export default YoungHome
