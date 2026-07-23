"use client"
import { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { useUser } from "../../contexts/UserContext"
import { useJobs } from "../../contexts/JobsContext"
import Header from "../../components/layout/Header"
import Sidebar from "../../components/layout/Sidebar"
import Navigation from "../../components/layout/Navigation"
import Button from "../../components/common/Button"
import demoCredentials from "../../data/demoCredentials.json"

const QUICK_ACCESS = [
  {
    icon: "psychology",
    title: "Test Vocacional",
    desc: "Descubre tus fortalezas y el mejor camino para tu carrera.",
    action: "Comenzar",
    path: "/test-vocacional",
  },
  {
    icon: "rocket_launch",
    title: "Empleos",
    desc: "Proyectos cortos de 1 a 5 días para ganar experiencia real.",
    action: "Explorar",
    path: "/empleos",
  },
  {
    icon: "school",
    title: "Cursos",
    desc: "Formación certificada en las habilidades más buscadas.",
    action: "Ver catálogo",
    path: "/cursos",
  },
  {
    icon: "history",
    title: "Postulaciones",
    desc: "Sigue el estado de tus aplicaciones en tiempo real.",
    action: "Ver historial",
    path: "/postulaciones",
  },
]

function KpiCard({ icon, value, label }) {
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-soft-200">
      <div className="w-9 h-9 rounded-lg bg-gray-soft-100 flex items-center justify-center text-primary-dark mb-3">
        <span className="material-symbols-outlined text-xl">{icon}</span>
      </div>
      <p className="text-2xl font-display font-bold text-primary-dark">{value}</p>
      <p className="text-xs text-gray-soft-300">{label}</p>
    </div>
  )
}

const YoungDashboard = () => {
  const { user } = useAuth()
  const { profile } = useUser()
  const { jobs, getUserApplications } = useJobs()
  const navigate = useNavigate()

  const applications = user ? getUserApplications(user.id) : []
  const vocationalTestDone = user ? !!localStorage.getItem(`mped_vocational_${user.id}`) : false

  const hasAvailability = Object.values(profile?.availability || {}).some((d) => d?.available)
  const profileChecks = [!!profile?.name, (profile?.skills?.length || 0) > 0, hasAvailability, (profile?.interests?.length || 0) > 0]
  const completedChecks = profileChecks.filter(Boolean).length
  const profilePercent = Math.round((completedChecks / profileChecks.length) * 100)

  const employabilityScore =
    profilePercent >= 100 ? "A+" : profilePercent >= 75 ? "A" : profilePercent >= 50 ? "B" : profilePercent >= 25 ? "C" : "D"

  const recommendedJobs = useMemo(() => {
    const interests = profile?.interests || []
    const active = jobs.filter((j) => j.status === "active")
    const matching = active.filter((j) => interests.includes(j.category))
    const rest = active.filter((j) => !interests.includes(j.category))
    return [...matching, ...rest].slice(0, 4)
  }, [jobs, profile])

  const nextSteps = [
    {
      show: !((profile?.skills?.length || 0) > 0),
      icon: "task_alt",
      title: "Agrega tus habilidades",
      desc: "Ayúdanos a encontrarte mejores microempleos",
    },
    {
      show: !hasAvailability,
      icon: "schedule",
      title: "Define tu disponibilidad",
      desc: "Indica cuándo puedes trabajar",
    },
    {
      show: !((profile?.interests?.length || 0) > 0),
      icon: "interests",
      title: "Selecciona tus intereses",
      desc: "Descubre oportunidades relevantes para ti",
    },
    {
      show: !profile?.photo,
      icon: "add_a_photo",
      title: "Sube tu foto de perfil",
      desc: "Los perfiles con foto generan más confianza",
    },
  ]
    .filter((step) => step.show)
    .slice(0, 2)

  return (
    <div className="min-h-screen bg-gray-soft-50 pb-20 md:pb-0">
      <Header />
      <Sidebar />
      <div className="md:ml-64">
      <div className="container-custom py-8 space-y-8">
        {/* Greeting */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-primary-dark mb-2 text-balance">
              Hola, {profile?.name || user?.name || "Joven"}. Tu primera oportunidad puede empezar aquí.
            </h1>
            <p className="text-gray-soft-300 max-w-xl">
              Continúa construyendo tu perfil profesional y descubre nuevos caminos en la economía digital.
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-soft-200 flex items-center gap-4 flex-shrink-0">
            <div className="text-right">
              <p className="text-xs text-gray-soft-300">Mi Score de Empleabilidad</p>
              <p className="text-2xl font-display font-bold text-primary-cyan">{employabilityScore}</p>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-primary-cyan border-t-transparent flex items-center justify-center">
              <span className="material-symbols-outlined text-primary-cyan">trending_up</span>
            </div>
          </div>
        </div>

        {/* KPI grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiCard icon="send" value={applications.length} label="Postulaciones activas" />
          <KpiCard icon="military_tech" value={demoCredentials.length} label="Credenciales" />
          <KpiCard icon="task_alt" value={profile?.skills?.length || 0} label="Habilidades registradas" />
          <KpiCard icon="search" value={recommendedJobs.length} label="Ofertas para ti" />
        </div>

        {/* Profile progress + next steps */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-primary-dark text-white rounded-xl p-8 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-display font-bold mb-2">Estado de tu Perfil</h2>
              <p className="opacity-80 mb-6">Completa tu perfil al 100% para acceder a mejores oportunidades.</p>
              <div className="flex items-end justify-between mb-2">
                <span className="text-2xl font-display font-bold">{profilePercent}% completado</span>
                <span className="text-sm opacity-70">{profileChecks.length - completedChecks} pasos restantes</span>
              </div>
              <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden mb-6">
                <div
                  className="bg-primary-cyan h-full transition-all duration-700"
                  style={{ width: `${profilePercent}%` }}
                />
              </div>
            </div>
            <Button variant="primary" onClick={() => navigate("/profile/young")}>
              {profilePercent >= 100 ? "Editar perfil" : "Completar perfil"}
            </Button>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-soft-200 flex flex-col gap-4">
            <h3 className="text-lg font-display font-bold text-primary-dark">Siguiente paso</h3>
            {nextSteps.length > 0 ? (
              <div className="flex-1 flex flex-col gap-3">
                {nextSteps.map((step) => (
                  <div key={step.title} className="flex gap-3 items-start bg-gray-soft-50 p-3 rounded-lg">
                    <span className="material-symbols-outlined text-primary-cyan text-2xl">{step.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-primary-dark">{step.title}</p>
                      <p className="text-xs text-gray-soft-300">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-soft-300 flex-1">
                ¡Tu perfil está completo! Sigue explorando oportunidades.
              </p>
            )}
            <Button variant="outline" fullWidth onClick={() => navigate("/profile/young")}>
              Ver todas las tareas
            </Button>
          </div>
        </div>

        {/* Quick access */}
        <div>
          <h3 className="text-lg font-display font-bold text-primary-dark mb-4">Accesos rápidos</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {QUICK_ACCESS.map((item) => {
              const isVocationalTest = item.title === "Test Vocacional"
              const path = isVocationalTest && vocationalTestDone ? "/test-vocacional/resultado" : item.path
              const actionLabel = isVocationalTest && vocationalTestDone ? "Ver resultado" : item.action
              return (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => navigate(path)}
                  className="relative text-left bg-white border border-gray-soft-200 rounded-xl p-5 transition-all hover:border-primary-cyan"
                >
                  <div className="w-11 h-11 bg-gray-soft-100 rounded-lg flex items-center justify-center text-primary-dark mb-3">
                    <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                  </div>
                  <h4 className="font-display font-semibold text-primary-dark mb-1">{item.title}</h4>
                  <p className="text-xs text-gray-soft-300 mb-3">{item.desc}</p>
                  <span className="text-sm font-semibold text-primary-cyan flex items-center gap-1">
                    {actionLabel} <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Recommended jobs */}
        <div className="bg-white rounded-xl border border-gray-soft-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-soft-200 flex justify-between items-center">
            <h3 className="text-lg font-display font-bold text-primary-dark">Recomendados para ti</h3>
            <button
              type="button"
              onClick={() => navigate("/empleos")}
              className="text-sm font-semibold text-primary-cyan hover:underline"
            >
              Ver todos
            </button>
          </div>
          <div className="divide-y divide-gray-soft-200">
            {recommendedJobs.length > 0 ? (
              recommendedJobs.map((job) => (
                <button
                  key={job.id}
                  type="button"
                  onClick={() => navigate(`/offer/${job.id}`)}
                  className="w-full px-6 py-4 flex items-center justify-between gap-4 hover:bg-gray-soft-50 transition-colors text-left"
                >
                  <div>
                    <p className="font-medium text-primary-dark">{job.title}</p>
                    <p className="text-sm text-gray-soft-300">
                      {job.company} · {job.location}
                    </p>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="hidden sm:inline-block px-3 py-1 bg-primary-cyan/15 text-primary-dark text-xs font-bold uppercase rounded-full">
                      {job.category}
                    </span>
                    <div className="text-right">
                      <p className="font-semibold text-primary-dark">${job.payment.toLocaleString()}</p>
                      <p className="text-xs text-gray-soft-300">{job.paymentType}</p>
                    </div>
                    <span className="material-symbols-outlined text-gray-soft-300">chevron_right</span>
                  </div>
                </button>
              ))
            ) : (
              <p className="px-6 py-8 text-center text-gray-soft-300">Aún no hay ofertas disponibles.</p>
            )}
          </div>
        </div>
      </div>
      </div>
      <Navigation />
    </div>
  )
}

export default YoungDashboard
