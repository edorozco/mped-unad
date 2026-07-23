import { useMemo, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useJobs } from '../../contexts/JobsContext'
import { useCourses } from '../../contexts/CoursesContext'
import Header from '../../components/layout/Header'
import Sidebar from '../../components/layout/Sidebar'
import Navigation from '../../components/layout/Navigation'
import Button from '../../components/common/Button'
import { ARCHETYPES } from '../../data/vocationalQuestions'

const VocationalResult = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { jobs } = useJobs()
  const { courses, isEnrolled } = useCourses()
  const [result, setResult] = useState(undefined)

  useEffect(() => {
    if (!user) return
    const saved = localStorage.getItem(`mped_vocational_${user.id}`)
    setResult(saved ? JSON.parse(saved) : null)
  }, [user])

  const ranked = useMemo(() => {
    if (!result) return []
    return Object.entries(result.counts)
      .map(([key, count]) => ({ ...ARCHETYPES[key], count }))
      .sort((a, b) => b.count - a.count)
  }, [result])

  const top = ranked[0]
  const second = ranked[1]
  const toReinforce = ranked.slice(-2).reverse()

  const recommendedJobs = useMemo(() => {
    if (!top) return []
    const categories = [...top.jobCategories, ...(second?.jobCategories || [])]
    const active = jobs.filter((j) => j.status === 'active')
    const matching = active.filter((j) => categories.includes(j.category))
    const rest = active.filter((j) => !categories.includes(j.category))
    return [...matching, ...rest].slice(0, 3)
  }, [jobs, top, second])

  const recommendedCourses = useMemo(() => {
    if (!top) return []
    const categories = [...top.courseCategories, ...(second?.courseCategories || [])]
    const matching = courses.filter((c) => categories.includes(c.category))
    const rest = courses.filter((c) => c.featured && !categories.includes(c.category))
    return [...matching, ...rest].slice(0, 3)
  }, [courses, top, second])

  const badgeCourse = recommendedCourses.find((c) => !isEnrolled(c.id))

  if (result === undefined) return null

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-soft-50 pb-20 md:pb-0">
        <Header />
        <Sidebar />
        <div className="md:ml-64">
          <div className="container-custom py-16 text-center max-w-lg mx-auto">
            <span className="material-symbols-outlined text-6xl text-primary-cyan mb-4">psychology</span>
            <h1 className="text-2xl font-display font-bold text-primary-dark mb-2">
              Aún no has realizado el test vocacional
            </h1>
            <p className="text-gray-soft-300 mb-8">
              Descubre tus fortalezas y las áreas donde tu talento brillará más.
            </p>
            <Button variant="primary" onClick={() => navigate('/test-vocacional')}>
              Comenzar test vocacional
            </Button>
          </div>
        </div>
        <Navigation />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-soft-50 pb-20 md:pb-0">
      <Header />
      <Sidebar />
      <div className="md:ml-64">
        <div className="container-custom py-8">
          {/* Header */}
          <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="bg-primary-cyan/15 text-primary-dark px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 inline-block">
                ¡Test completado!
              </span>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-primary-dark">Tus áreas sugeridas</h1>
              <p className="text-gray-soft-300 max-w-2xl mt-2">{top.summary}</p>
            </div>
            <Button variant="primary" size="lg" onClick={() => navigate('/empleos')}>
              <span className="flex items-center gap-2">
                Ver microempleos recomendados
                <span className="material-symbols-outlined text-xl">arrow_forward</span>
              </span>
            </Button>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main column */}
            <section className="lg:col-span-8 flex flex-col gap-6">
              {/* Top recommendations */}
              <div className="bg-white border border-gray-soft-200 rounded-xl p-8">
                <h2 className="font-display text-lg font-bold text-primary-dark mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary-cyan">verified</span>
                  Tu perfil vocacional
                </h2>
                <div className="space-y-4">
                  {ranked.map((archetype, idx) => (
                    <div
                      key={archetype.key}
                      className="flex items-center gap-6 p-4 rounded-lg bg-gray-soft-50 border border-gray-soft-200 hover:border-primary-cyan transition-all group"
                    >
                      <div
                        className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 ${
                          idx === 0 ? 'bg-primary-dark text-white' : 'bg-gray-soft-100 text-primary-dark'
                        }`}
                      >
                        <span className="material-symbols-outlined text-2xl">{archetype.icon}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-display font-semibold text-primary-dark">{archetype.label}</h3>
                        <p className="text-sm text-gray-soft-300">{archetype.summary}</p>
                      </div>
                      <span className="text-sm font-bold text-primary-cyan flex-shrink-0">
                        {Math.round((archetype.count / result.totalQuestions) * 100)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended jobs */}
              <div className="bg-white border border-gray-soft-200 rounded-xl p-8">
                <h2 className="font-display text-lg font-bold text-primary-dark mb-6">Microempleos recomendados</h2>
                <div className="space-y-3">
                  {recommendedJobs.map((job) => (
                    <button
                      key={job.id}
                      type="button"
                      onClick={() => navigate(`/offer/${job.id}`)}
                      className="w-full flex items-center justify-between gap-4 p-4 rounded-lg border border-gray-soft-200 hover:border-primary-cyan transition-all text-left"
                    >
                      <div>
                        <p className="font-medium text-primary-dark">{job.title}</p>
                        <p className="text-sm text-gray-soft-300">
                          {job.company} · {job.location}
                        </p>
                      </div>
                      <span className="material-symbols-outlined text-gray-soft-300">chevron_right</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recommended courses */}
              <div className="bg-white border border-gray-soft-200 rounded-xl p-8">
                <h2 className="font-display text-lg font-bold text-primary-dark mb-6">Cursos para potenciar tu perfil</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {recommendedCourses.map((course) => (
                    <button
                      key={course.id}
                      type="button"
                      onClick={() => navigate(`/cursos/${course.id}`)}
                      className="flex flex-col gap-3 p-4 bg-gray-soft-50 border border-gray-soft-200 rounded-lg hover:shadow-md hover:border-primary-cyan transition-all text-left"
                    >
                      <div className="w-full h-24 rounded-lg bg-primary-dark/5 flex items-center justify-center">
                        <span className="material-symbols-outlined text-4xl text-primary-dark/40">{course.icon}</span>
                      </div>
                      <span className="text-xs text-primary-cyan font-bold uppercase tracking-wider">
                        {course.category}
                      </span>
                      <h4 className="font-medium text-primary-dark text-sm">{course.title}</h4>
                      <span className="text-sm font-semibold text-primary-cyan flex items-center gap-1">
                        Comenzar <span className="material-symbols-outlined text-sm">open_in_new</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Sidebar insights */}
            <aside className="lg:col-span-4 flex flex-col gap-6">
              <div className="bg-primary-dark text-white rounded-xl p-8 relative overflow-hidden shadow-xl">
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-primary-cyan opacity-20 rounded-full" />
                <h2 className="font-display text-lg font-bold mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined">star</span>
                  Tus fortalezas
                </h2>
                <ul className="space-y-4">
                  {top.strengths.map((strength) => (
                    <li key={strength} className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary-cyan">check_circle</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 p-4 bg-white/10 rounded-lg border border-white/20">
                  <p className="text-sm italic opacity-90">"{top.summary}"</p>
                </div>
              </div>

              <div className="bg-white border border-gray-soft-200 rounded-xl p-8">
                <h2 className="font-display text-lg font-bold text-primary-dark mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-accent-gold">trending_up</span>
                  Habilidades a reforzar
                </h2>
                <div className="space-y-6">
                  {toReinforce.map((archetype) => {
                    const percent = Math.round((archetype.count / result.totalQuestions) * 100)
                    return (
                      <div key={archetype.key}>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-primary-dark">{archetype.reinforceLabel}</span>
                          <span className="text-sm text-gray-soft-300">{percent}%</span>
                        </div>
                        <div className="w-full bg-gray-soft-200 rounded-full h-2">
                          <div className="bg-primary-cyan h-2 rounded-full" style={{ width: `${percent}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {badgeCourse && (
                <div className="bg-white border-2 border-dashed border-gray-soft-200 rounded-xl p-8 flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary-dark to-primary-cyan flex items-center justify-center shadow-lg mb-4">
                    <span
                      className="material-symbols-outlined text-white text-4xl"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      military_tech
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-primary-dark mb-2">Próximo distintivo</h3>
                  <p className="text-sm text-gray-soft-300 mb-4">
                    Completa el curso "{badgeCourse.title}" para obtener tu primera micro-credencial.
                  </p>
                  <Button variant="outline" fullWidth onClick={() => navigate(`/cursos/${badgeCourse.id}`)}>
                    Ver curso
                  </Button>
                </div>
              )}

              <Button variant="ghost" fullWidth onClick={() => navigate('/test-vocacional')}>
                Volver a realizar el test
              </Button>
            </aside>
          </div>
        </div>
      </div>
      <Navigation />
    </div>
  )
}

export default VocationalResult
