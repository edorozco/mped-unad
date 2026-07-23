import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCourses } from '../../contexts/CoursesContext'
import { useAuth } from '../../contexts/AuthContext'
import Header from '../../components/layout/Header'
import Sidebar from '../../components/layout/Sidebar'
import Navigation from '../../components/layout/Navigation'
import Button from '../../components/common/Button'

const TABS = [
  { id: 'syllabus', label: 'Temario del Curso' },
  { id: 'instructor', label: 'Sobre el Instructor' },
  { id: 'reviews', label: 'Reseñas' },
]

const CourseDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getCourseById, isEnrolled, enroll } = useCourses()
  const { user, isAuthenticated } = useAuth()
  const showSidebar = isAuthenticated && user?.role === 'young'
  const [activeTab, setActiveTab] = useState('syllabus')

  const course = getCourseById(id)

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-soft-50">
        <Header />
        {showSidebar && <Sidebar />}
        <div className={`${showSidebar ? 'md:ml-64' : ''} container-custom py-12 text-center`}>
          <h2 className="text-2xl font-bold text-primary-dark mb-4">Curso no encontrado</h2>
          <Button onClick={() => navigate('/cursos')}>Volver al catálogo</Button>
        </div>
      </div>
    )
  }

  const enrolled = isEnrolled(course.id)

  const handleEnroll = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/cursos/${course.id}` } })
      return
    }
    enroll(course.id)
  }

  return (
    <div className="min-h-screen bg-gray-soft-50 pb-20 md:pb-0">
      <Header />
      {showSidebar && <Sidebar />}
      <div className={showSidebar ? 'md:ml-64' : ''}>
        <div className="container-custom py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-8 text-sm text-gray-soft-300">
            <button type="button" onClick={() => navigate('/home')} className="hover:text-primary-cyan">
              Inicio
            </button>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
            <button type="button" onClick={() => navigate('/cursos')} className="hover:text-primary-cyan">
              Cursos
            </button>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
            <span className="text-primary-dark font-semibold">{course.title}</span>
          </nav>

          {/* Hero */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            <div className="lg:col-span-7 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                {course.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-primary-cyan/15 text-primary-dark px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                  >
                    {tag}
                  </span>
                ))}
                <div className="flex items-center gap-1 text-accent-gold">
                  <span className="material-symbols-outlined text-base">star</span>
                  <span className="text-sm font-medium text-primary-dark">
                    {course.rating} ({(course.reviews / 1000).toFixed(1)}k reseñas)
                  </span>
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-primary-dark mb-4 leading-tight">
                {course.title}
              </h1>
              <p className="text-lg text-gray-soft-300 mb-8 max-w-2xl">{course.shortDescription}</p>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary" size="lg" onClick={handleEnroll}>
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-xl">
                      {enrolled ? 'play_circle' : 'rocket_launch'}
                    </span>
                    {enrolled ? 'Continuar curso' : 'Comenzar ahora'}
                  </span>
                </Button>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="relative aspect-video bg-primary-dark/5 rounded-xl border border-gray-soft-200 flex items-center justify-center">
                <span className="material-symbols-outlined text-7xl text-primary-dark/40">{course.icon}</span>
              </div>
            </div>
          </section>

          {/* Content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Tabs */}
            <div className="lg:col-span-8">
              <div className="flex border-b border-gray-soft-200 mb-8 overflow-x-auto">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'text-primary-dark border-primary-cyan'
                        : 'text-gray-soft-300 border-transparent hover:text-primary-dark'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {activeTab === 'syllabus' && (
                <div className="space-y-4">
                  {course.modules.map((module) => (
                    <div key={module.id} className="border border-gray-soft-200 rounded-lg overflow-hidden bg-white">
                      <div className="p-4 bg-gray-soft-50 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-white ${
                              module.locked ? 'bg-gray-soft-300' : 'bg-primary-dark'
                            }`}
                          >
                            {module.id}
                          </div>
                          <h3 className={`font-semibold ${module.locked ? 'text-gray-soft-300' : 'text-primary-dark'}`}>
                            {module.title}
                          </h3>
                        </div>
                        <span className="material-symbols-outlined text-gray-soft-300">
                          {module.locked ? 'lock' : 'expand_more'}
                        </span>
                      </div>
                      {!module.locked && module.lessons && (
                        <div className="p-4 space-y-3">
                          {module.lessons.map((lesson) => (
                            <div
                              key={lesson.title}
                              className="flex items-center justify-between py-2 border-b border-gray-soft-100 last:border-0"
                            >
                              <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary-cyan">
                                  {lesson.type === 'pdf' ? 'description' : 'play_circle'}
                                </span>
                                <span className="text-sm text-primary-dark">{lesson.title}</span>
                              </div>
                              <span className="text-xs text-gray-soft-300">{lesson.duration}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'instructor' && (
                <div className="flex flex-col sm:flex-row items-start gap-6 bg-white p-6 rounded-xl border border-gray-soft-200">
                  <div className="w-24 h-24 rounded-full bg-primary-cyan/15 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-4xl text-primary-dark">person</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-bold text-primary-dark mb-1">
                      {course.instructor.name}
                    </h3>
                    <p className="text-sm font-medium text-primary-cyan mb-4">
                      {course.instructor.title} en {course.instructor.company}
                    </p>
                    <p className="text-gray-soft-300 leading-relaxed">{course.instructor.bio}</p>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="flex items-center gap-4 p-6 bg-white rounded-lg border border-gray-soft-200">
                  <div className="text-center px-4 border-r border-gray-soft-200">
                    <div className="text-4xl font-bold text-primary-dark">{course.rating}</div>
                    <div className="text-accent-gold flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="material-symbols-outlined text-lg">
                          star
                        </span>
                      ))}
                    </div>
                    <div className="text-xs text-gray-soft-300 mt-1">Calificación del curso</div>
                  </div>
                  <p className="text-gray-soft-300 text-sm">
                    {course.reviews.toLocaleString('es-CO')} estudiantes han calificado este curso.
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4 space-y-8">
              <div className="bg-white p-6 rounded-xl border border-gray-soft-200">
                <h3 className="text-lg font-display font-bold text-primary-dark mb-6">¿Qué aprenderás?</h3>
                <ul className="space-y-4">
                  {course.whatYouWillLearn.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-primary-cyan mt-0.5">check_circle</span>
                      <span className="text-sm text-primary-dark">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-soft-50 p-6 rounded-xl border border-dashed border-gray-soft-200">
                <h3 className="text-lg font-display font-bold text-primary-dark mb-6">Requisitos</h3>
                <ul className="space-y-4">
                  {course.requirements.map((req) => (
                    <li key={req} className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-gray-soft-300">check</span>
                      <span className="text-sm text-gray-soft-300">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-primary-dark text-white p-6 rounded-xl flex items-center gap-4">
                <div>
                  <h4 className="text-sm font-semibold mb-1">Insignia Digital</h4>
                  <p className="text-xs opacity-90">Este curso otorga el certificado "{course.badgeName}".</p>
                </div>
                <div className="ml-auto w-14 h-14 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-2xl">verified</span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
      <Navigation />
    </div>
  )
}

export default CourseDetail
