import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useUser } from '../../contexts/UserContext'
import { useCourses } from '../../contexts/CoursesContext'
import Header from '../../components/layout/Header'
import Sidebar from '../../components/layout/Sidebar'
import Navigation from '../../components/layout/Navigation'
import Button from '../../components/common/Button'
import demoCredentials from '../../data/demoCredentials.json'

const Credentials = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const { profile } = useUser()
  const { courses, enrollments, isEnrolled } = useCourses()
  const showSidebar = isAuthenticated && user?.role === 'young'

  const profileChecks = [!!profile?.name, (profile?.skills?.length || 0) > 0, Object.values(profile?.availability || {}).some((d) => d?.available), (profile?.interests?.length || 0) > 0]
  const profilePercent = Math.round((profileChecks.filter(Boolean).length / profileChecks.length) * 100)
  const employabilityScore =
    profilePercent >= 100 ? 'A+' : profilePercent >= 75 ? 'A' : profilePercent >= 50 ? 'B' : profilePercent >= 25 ? 'C' : 'D'
  const employabilityLabel =
    employabilityScore === 'A+' ? 'Sobresaliente' : employabilityScore === 'A' ? 'Muy bueno' : employabilityScore === 'B' ? 'Bueno' : employabilityScore === 'C' ? 'En progreso' : 'Por comenzar'

  const nextCourse = useMemo(() => courses.find((c) => !isEnrolled(c.id)), [courses, isEnrolled])

  const inProgressCourses = useMemo(() => {
    const earnedCategories = demoCredentials.map((c) => c.category)
    return courses.filter((c) => enrollments.includes(c.id) && !earnedCategories.includes(c.category))
  }, [courses, enrollments])

  return (
    <div className="min-h-screen bg-gray-soft-50 pb-20 md:pb-0">
      <Header />
      {showSidebar && <Sidebar />}
      <div className={showSidebar ? 'md:ml-64' : ''}>
        <div className="container-custom py-8">
          <header className="mb-10">
            <h1 className="text-2xl md:text-3xl font-display font-bold text-primary-dark mb-2">Mis Credenciales</h1>
            <p className="text-gray-soft-300">
              Tu progreso es impresionante. Cada credencial es un paso más hacia tu primer empleo digital.
            </p>
          </header>

          {/* Summary stats */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white border border-gray-soft-200 rounded-xl p-6 flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-primary-dark flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-3xl text-white" style={{ fontVariationSettings: "'FILL' 1" }}>
                  workspace_premium
                </span>
              </div>
              <div className="min-w-0">
                <span className="block text-xs font-bold text-gray-soft-300 uppercase tracking-wider">Total de credenciales</span>
                <p className="text-3xl font-display font-bold text-primary-dark">{demoCredentials.length}</p>
              </div>
            </div>
            <div className="bg-white border border-gray-soft-200 rounded-xl p-6 flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-primary-cyan/15 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-3xl text-primary-dark">trending_up</span>
              </div>
              <div className="min-w-0">
                <span className="block text-xs font-bold text-gray-soft-300 uppercase tracking-wider">Próxima a obtener</span>
                <p className="font-display font-bold text-primary-dark truncate">
                  {nextCourse ? nextCourse.badgeName : '¡Ya tienes todas!'}
                </p>
              </div>
            </div>
            <div className="bg-white border border-gray-soft-200 rounded-xl p-6 flex items-center gap-6 relative overflow-hidden">
              <div className="w-16 h-16 rounded-full bg-accent-gold flex items-center justify-center flex-shrink-0">
                <span className="font-display font-bold text-white text-xl">{employabilityScore}</span>
              </div>
              <div className="min-w-0">
                <span className="block text-xs font-bold text-gray-soft-300 uppercase tracking-wider">Nivel de empleabilidad</span>
                <p className="font-display font-bold text-primary-dark truncate">{employabilityLabel}</p>
              </div>
              <span className="material-symbols-outlined absolute -right-2 -bottom-2 text-8xl text-primary-dark/5">stars</span>
            </div>
          </section>

          {/* Earned credentials */}
          <section className="mb-12">
            <h2 className="text-lg font-display font-bold text-primary-dark mb-6">Credenciales Obtenidas</h2>
            {demoCredentials.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {demoCredentials.map((badge) => (
                  <div
                    key={badge.id}
                    className="bg-white border border-gray-soft-200 rounded-xl p-6 hover:shadow-lg transition-all"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-dark to-primary-cyan flex items-center justify-center text-3xl">
                        {badge.icon}
                      </div>
                      <span className="bg-primary-cyan/15 text-primary-dark text-xs px-3 py-1 rounded-full font-bold">
                        {badge.category}
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-lg text-primary-dark mb-1">{badge.name}</h3>
                    <p className="text-sm text-gray-soft-300 mb-4">
                      Otorgado por: <span className="font-semibold">MPED Academic</span>
                    </p>
                    <div className="flex items-center gap-2 text-gray-soft-300 mb-6">
                      <span className="material-symbols-outlined text-sm">calendar_today</span>
                      <span className="text-xs">
                        Obtenido el{' '}
                        {new Date(badge.earnedDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <Button variant="primary" fullWidth onClick={() => navigate(`/credentials/${badge.id}`)}>
                      <span className="flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-sm">visibility</span>
                        Ver certificado
                      </span>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-dashed border-gray-soft-200 rounded-xl p-12 text-center">
                <span className="material-symbols-outlined text-5xl text-gray-soft-300 mb-4">workspace_premium</span>
                <h3 className="text-lg font-display font-bold text-primary-dark mb-2">Aún no tienes credenciales</h3>
                <p className="text-gray-soft-300">Completa trabajos y cursos para ganar credenciales que validen tus habilidades.</p>
              </div>
            )}
          </section>

          {/* In progress */}
          {inProgressCourses.length > 0 && (
            <section>
              <h2 className="text-lg font-display font-bold text-primary-dark mb-6">En Progreso</h2>
              <div className="max-w-4xl space-y-4">
                {inProgressCourses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-white border border-gray-soft-200 rounded-lg p-5 flex flex-col md:flex-row items-center gap-6"
                  >
                    <div className="w-12 h-12 rounded-full bg-gray-soft-50 flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-primary-dark">{course.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-primary-dark">{course.title}</h4>
                      <p className="text-xs text-gray-soft-300">Otorga la credencial "{course.badgeName}" al completarlo</p>
                    </div>
                    <Button variant="outline" onClick={() => navigate(`/cursos/${course.id}`)}>
                      Continuar
                    </Button>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
      <Navigation />
    </div>
  )
}

export default Credentials
