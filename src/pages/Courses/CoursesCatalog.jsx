import { useState, useMemo, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import useEmblaCarousel from 'embla-carousel-react'
import { useCourses } from '../../contexts/CoursesContext'
import { useAuth } from '../../contexts/AuthContext'
import Header from '../../components/layout/Header'
import Sidebar from '../../components/layout/Sidebar'
import Navigation from '../../components/layout/Navigation'

const CoursesCatalog = () => {
  const navigate = useNavigate()
  const { courses, isEnrolled } = useCourses()
  const { user, isAuthenticated } = useAuth()
  const showSidebar = isAuthenticated && user?.role === 'young'
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Todos')

  const categories = useMemo(() => ['Todos', ...new Set(courses.map((c) => c.category))], [courses])

  const filteredCourses = useMemo(() => {
    const searchLower = search.trim().toLowerCase()
    return courses.filter((course) => {
      const matchesCategory = category === 'Todos' || course.category === category
      const matchesSearch =
        !searchLower ||
        course.title.toLowerCase().includes(searchLower) ||
        course.instructor.name.toLowerCase().includes(searchLower) ||
        course.category.toLowerCase().includes(searchLower)
      return matchesCategory && matchesSearch
    })
  }, [courses, search, category])

  const featuredCourses = courses.filter((c) => c.featured)

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' })

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    const autoplay = setInterval(() => emblaApi.scrollNext(), 4000)
    return () => clearInterval(autoplay)
  }, [emblaApi])

  return (
    <div className="min-h-screen bg-gray-soft-50 pb-20 md:pb-0">
      <Header />
      {showSidebar && <Sidebar />}
      <div className={showSidebar ? 'md:ml-64' : ''}>
        <div className="container-custom py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold text-primary-dark">Catálogo de Educación</h1>
              <p className="text-gray-soft-300">Explora cursos y certificaciones para potenciar tu carrera digital.</p>
            </div>
            <div className="relative w-full md:w-96">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-soft-300">
                search
              </span>
              <input
                type="text"
                placeholder="Buscar cursos, habilidades o instructores..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-soft-200 focus:outline-none focus:ring-2 focus:ring-primary-cyan focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-3 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === cat
                    ? 'bg-primary-dark text-white'
                    : 'bg-white border border-gray-soft-200 text-gray-soft-300 hover:bg-gray-soft-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Featured */}
          {featuredCourses.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-accent-gold">star</span>
                  <h2 className="text-xl font-display font-bold text-primary-dark">Cursos Destacados</h2>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={scrollPrev}
                    aria-label="Anterior"
                    className="w-9 h-9 rounded-full border border-gray-soft-200 flex items-center justify-center text-primary-dark hover:bg-gray-soft-100 transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl">chevron_left</span>
                  </button>
                  <button
                    type="button"
                    onClick={scrollNext}
                    aria-label="Siguiente"
                    className="w-9 h-9 rounded-full border border-gray-soft-200 flex items-center justify-center text-primary-dark hover:bg-gray-soft-100 transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl">chevron_right</span>
                  </button>
                </div>
              </div>
              <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex -ml-6">
                  {featuredCourses.map((course) => (
                    <div key={course.id} className="flex-[0_0_100%] sm:flex-[0_0_50%] min-w-0 pl-6">
                      <button
                        type="button"
                        onClick={() => navigate(`/cursos/${course.id}`)}
                        className="w-full h-full text-left bg-white rounded-xl border border-gray-soft-200 overflow-hidden hover:shadow-lg transition-shadow flex flex-col sm:flex-row"
                      >
                        <div className="sm:w-1/3 h-32 sm:h-auto bg-primary-dark/5 flex items-center justify-center flex-shrink-0">
                          <span className="material-symbols-outlined text-5xl text-primary-dark">{course.icon}</span>
                        </div>
                        <div className="p-6 flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {course.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 rounded bg-primary-cyan/15 text-primary-dark text-[10px] font-bold uppercase tracking-wider"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <h3 className="text-lg font-display font-bold text-primary-dark mb-2 leading-tight">
                            {course.title}
                          </h3>
                          <p className="text-sm text-gray-soft-300 mb-4 line-clamp-2">{course.shortDescription}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-gray-soft-300">{course.instructor.name}</span>
                            <span className="text-sm font-semibold text-primary-cyan">
                              {isEnrolled(course.id) ? 'Continuar curso' : 'Ver curso'}
                            </span>
                          </div>
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Grid */}
          <section>
            <h2 className="text-xl font-display font-bold text-primary-dark mb-6">Explorar Todos los Cursos</h2>
            {filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCourses.map((course) => (
                  <button
                    key={course.id}
                    type="button"
                    onClick={() => navigate(`/cursos/${course.id}`)}
                    className="text-left bg-white rounded-xl border border-gray-soft-200 hover:border-primary-cyan transition-colors overflow-hidden flex flex-col"
                  >
                    <div className="h-32 bg-primary-dark/5 flex items-center justify-center">
                      <span className="material-symbols-outlined text-4xl text-primary-dark">{course.icon}</span>
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <p className="text-[10px] font-bold text-primary-cyan uppercase tracking-widest mb-1">
                        {course.category}
                      </p>
                      <h4 className="font-semibold text-primary-dark mb-2 line-clamp-2">{course.title}</h4>
                      <p className="text-xs text-gray-soft-300 mb-4">{course.instructor.name}</p>
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-soft-200 text-xs">
                        <div>
                          <p className="text-gray-soft-300 uppercase font-bold text-[10px]">Duración</p>
                          <p className="font-semibold text-primary-dark">{course.duration}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-soft-300 uppercase font-bold text-[10px]">Nivel</p>
                          <p className="font-semibold text-primary-dark">{course.level}</p>
                        </div>
                      </div>
                      {isEnrolled(course.id) && (
                        <span className="mt-3 inline-block text-xs font-bold text-primary-cyan">
                          ✓ Inscrito
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-soft-300 py-12">
                No encontramos cursos que coincidan con tu búsqueda.
              </p>
            )}
          </section>
        </div>
      </div>
      <Navigation />
    </div>
  )
}

export default CoursesCatalog
