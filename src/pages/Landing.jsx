"use client"
import { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { useJobs } from "../contexts/JobsContext"
import Header from "../components/layout/Header"
import Button from "../components/common/Button"
import JobCard from "../components/jobs/JobCard"
import AcademicTeamCards from "../components/academic/AcademicTeamCards"

const PROBLEMS = [
  {
    icon: "block",
    iconBg: "bg-red-100 text-red-600",
    title: "Falta de experiencia",
    desc: "El círculo vicioso: nadie te contrata sin experiencia, y no puedes ganar experiencia si nadie te contrata.",
  },
  {
    icon: "explore_off",
    iconBg: "bg-primary-cyan/15 text-primary-dark",
    title: "Poca orientación laboral",
    desc: "Saber qué estudiar es difícil, pero saber cómo aplicar esos conocimientos al mundo real es el verdadero reto.",
  },
  {
    icon: "wifi_off",
    iconBg: "bg-primary-cyan/15 text-[#007261]",
    title: "Baja conexión",
    desc: "La distancia entre lo que las empresas digitales necesitan y las habilidades que aprendes es cada vez mayor.",
  },
]

const JOURNEY_STEPS = [
  { icon: "person", label: "Joven" },
  { icon: "badge", label: "Perfil" },
  { icon: "quiz", label: "Test" },
  { icon: "school", label: "Formación", highlight: true },
  { icon: "work", label: "Microempleos" },
  { icon: "send", label: "Postulación" },
  { icon: "military_tech", label: "Credencial", highlight: true },
]

const TESTIMONIALS = [
  {
    quote:
      "MPED me dio la oportunidad que nadie más me daba. Mi primer microempleo como gestor de datos me permitió pagar mis estudios y ganar confianza.",
    author: "Carlos Ruiz",
    role: "Estudiante de Ingeniería",
    avatarBg: "bg-primary-cyan/25",
  },
  {
    quote:
      "Encontrar talento joven comprometido era un reto. Con MPED hemos incorporado 5 jóvenes para tareas específicas y el resultado es excelente.",
    author: "Marta Jimeno",
    role: "CEO en TechFlow",
    avatarBg: "bg-primary-cyan/25",
  },
  {
    quote:
      "Las credenciales son geniales. Pude mostrarle a mi actual jefe lo que sabía hacer con pruebas reales certificadas por MPED.",
    author: "Lucía Fernández",
    role: "UX Designer Jr.",
    avatarBg: "bg-accent-gold/25",
  },
]

const ODS_GOALS = [
  {
    num: "01",
    color: "#E5243B",
    title: "Fin de la pobreza",
    desc: "Facilitamos ingresos dignos a través del acceso al primer empleo digital remunerado.",
  },
  {
    num: "04",
    color: "#C5192D",
    title: "Educación de calidad",
    desc: "Formación continua y específica en competencias tecnológicas demandadas.",
  },
  {
    num: "08",
    color: "#A21942",
    title: "Trabajo decente",
    desc: "Fomentamos el crecimiento económico inclusivo y el empleo productivo para jóvenes.",
  },
  {
    num: "10",
    color: "#DD1367",
    title: "Reducción de desigualdades",
    desc: "Democratizamos el acceso a oportunidades laborales sin importar el origen.",
  },
]

const Landing = () => {
  const navigate = useNavigate()
  const { jobs } = useJobs()

  const publishedVacancies = useMemo(() => {
    return [...jobs]
      .filter((j) => j.status === "active")
      .sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured))
      .slice(0, 3)
  }, [jobs])

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gray-soft-50 py-20 md:py-28">
          <div className="container-custom relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="max-w-xl">
                <span className="inline-block bg-primary-cyan/15 text-[#007261] px-4 py-1 rounded-full text-sm font-semibold mb-6">
                  Nueva era digital para jóvenes
                </span>
                <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 text-primary-dark leading-tight text-balance">
                  Mi Primer Empleo Digital – MPED
                </h1>
                <p className="text-lg md:text-xl text-gray-soft-300 mb-10 leading-relaxed text-balance">
                  Conectamos jóvenes de 16 a 25 años sin experiencia con microempleos reales, formación continua
                  y credenciales digitales que validan tu talento ante el mercado.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button variant="primary" size="lg" onClick={() => navigate("/onboarding")}>
                    <span className="flex items-center gap-2">
                      Soy joven <span className="material-symbols-outlined text-xl">rocket_launch</span>
                    </span>
                  </Button>
                  <Button variant="secondary" size="lg" onClick={() => navigate("/auth/employer/register")}>
                    <span className="flex items-center gap-2">
                      Soy empresa <span className="material-symbols-outlined text-xl">business_center</span>
                    </span>
                  </Button>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-4 bg-primary-cyan/20 blur-2xl rounded-full" />
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-video">
                  <img
                    className="w-full h-full object-cover"
                    alt="Jóvenes colaborando en un espacio de trabajo digital moderno"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1q3Z3SUPGFMd_A95TRRnua1BmYVh1KAz6ZHtzxr-tmwh4IsGkKLnZEi2Eh8RsDgXBHO-Yt1LhPIR5OGcO4a2N_6Gi7z8vzG1f_h-HYLR5YEvZwWr1i5Nh97QWjZGF2P5_DG9pVrUmmbRxasgOybzOe5uDdQrOntjNyra0HzoJkSaS8rrTfYFy5_uv2NvXWBbIoafaEPfOpt4XyZLIK0Orqqk4uUE42yH9EpylfZHTORFGNRG7NXY"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-primary-dark text-white">
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-display font-bold mb-2">2.500+</p>
                <p className="text-xs md:text-sm uppercase tracking-widest opacity-80">Jóvenes empleados</p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-display font-bold mb-2">890+</p>
                <p className="text-xs md:text-sm uppercase tracking-widest opacity-80">Empresas activas</p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-display font-bold mb-2">$2.3M</p>
                <p className="text-xs md:text-sm uppercase tracking-widest opacity-80">Pagado a trabajadores</p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-display font-bold mb-2 flex items-center justify-center gap-1">
                  4.8 <span className="material-symbols-outlined text-accent-gold">star</span>
                </p>
                <p className="text-xs md:text-sm uppercase tracking-widest opacity-80">Calificación promedio</p>
              </div>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="py-20 bg-gray-soft-50">
          <div className="container-custom">
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-display font-bold text-primary-dark mb-4 text-balance">
                ¿Por qué es difícil empezar?
              </h2>
              <p className="text-gray-soft-300">
                Identificamos las barreras que separan el talento joven de las oportunidades digitales hoy en día.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {PROBLEMS.map((problem) => (
                <div
                  key={problem.title}
                  className="group bg-white p-8 rounded-2xl border border-gray-soft-200 hover:border-primary-cyan transition-all"
                >
                  <div
                    className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${problem.iconBg}`}
                  >
                    <span className="material-symbols-outlined text-3xl">{problem.icon}</span>
                  </div>
                  <h3 className="text-xl font-display font-semibold text-primary-dark mb-3">{problem.title}</h3>
                  <p className="text-gray-soft-300 leading-relaxed">{problem.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Explora Microempleos */}
        <section className="py-20 bg-white">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div>
                <h2 className="text-3xl md:text-5xl font-display font-bold text-primary-dark mb-4 text-balance">
                  Explora Microempleos
                </h2>
                <p className="text-gray-soft-300 max-w-xl">
                  Oportunidades reales diseñadas para tu primer contacto con el mundo laboral digital.
                </p>
              </div>
              <Button variant="primary" onClick={() => navigate("/empleos")}>
                <span className="flex items-center gap-2">
                  Ver catálogo completo <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </span>
              </Button>
            </div>

            {publishedVacancies.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {publishedVacancies.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-soft-300">Pronto podrás ver aquí las vacantes publicadas.</p>
            )}
          </div>
        </section>

        {/* Tu camino al éxito digital */}
        <section className="py-20 bg-gray-soft-50 overflow-hidden">
          <div className="container-custom">
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-display font-bold text-primary-dark mb-4 text-balance">
                Tu camino al éxito digital
              </h2>
              <p className="text-gray-soft-300">
                Un ecosistema diseñado para escalar paso a paso desde el aprendizaje hasta el empleo.
              </p>
            </div>

            <div className="relative">
              <div className="hidden lg:block absolute top-8 left-0 w-full h-1 bg-gradient-to-r from-primary-dark to-primary-cyan opacity-20" />
              <div className="grid grid-cols-2 lg:grid-cols-7 gap-6 relative z-10">
                {JOURNEY_STEPS.map((step) => (
                  <div key={step.label} className="flex flex-col items-center text-center group">
                    <div
                      className={`w-16 h-16 rounded-full text-white flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform ${
                        step.highlight ? "bg-primary-cyan ring-4 ring-primary-cyan/20" : "bg-primary-dark"
                      }`}
                    >
                      <span className="material-symbols-outlined">{step.icon}</span>
                    </div>
                    <h4 className={`text-sm font-semibold ${step.highlight ? "text-[#007261]" : "text-primary-dark"}`}>
                      {step.label}
                    </h4>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-16 bg-primary-dark rounded-3xl p-10 md:p-12 flex flex-col md:flex-row items-center gap-12 text-white">
              <div className="md:w-1/2">
                <h3 className="text-2xl md:text-3xl font-display font-bold mb-4">Credenciales que valen oro</h3>
                <p className="opacity-90 mb-8 leading-relaxed">
                  Nuestras credenciales utilizan tecnología blockchain para asegurar que tus habilidades son
                  verificables, permanentes y reconocidas por líderes del sector tecnológico.
                </p>
                <ul className="space-y-3">
                  {["100% Verificables", "Compatibles con LinkedIn", "Basadas en proyectos reales"].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary-cyan">check_circle</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="md:w-1/2 grid grid-cols-2 gap-4">
                {[
                  { icon: "code", label: "Frontend dev" },
                  { icon: "brush", label: "UI Design" },
                ].map((badge, idx) => (
                  <div
                    key={badge.label}
                    className={`aspect-square rounded-2xl bg-white/10 p-4 flex flex-col items-center justify-center backdrop-blur ${
                      idx === 1 ? "translate-y-8" : ""
                    }`}
                  >
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary-cyan to-primary-cyan flex items-center justify-center mb-4 border-2 border-white/20">
                      <span className="material-symbols-outlined text-4xl text-white">{badge.icon}</span>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-center">{badge.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-white">
          <div className="container-custom">
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-display font-bold text-primary-dark mb-4 text-balance">
                Lo que dicen de MPED
              </h2>
              <p className="text-gray-soft-300">
                Historias reales de jóvenes y empresas que están transformando el futuro digital.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {TESTIMONIALS.map((testimonial) => (
                <div
                  key={testimonial.author}
                  className="relative p-8 rounded-2xl bg-gray-soft-50 border border-gray-soft-200"
                >
                  <span
                    className="material-symbols-outlined absolute top-4 left-4 text-primary-dark/10"
                    style={{ fontSize: "56px" }}
                  >
                    format_quote
                  </span>
                  <p className="relative z-10 text-gray-soft-300 mb-6 italic leading-relaxed">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full ${testimonial.avatarBg}`} />
                    <div>
                      <p className="font-display font-semibold text-primary-dark">{testimonial.author}</p>
                      <p className="text-sm text-gray-soft-300">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Nuestro equipo — proyecto académico */}
        <section className="py-20 bg-gray-soft-50 border-t border-gray-soft-200">
          <div className="container-custom">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-display font-bold text-primary-dark mb-4 text-balance">
                Nuestro equipo
              </h2>
              <p className="text-lg text-gray-soft-300 leading-relaxed">
                Emprendimiento de Base Tecnológica · Universidad Nacional Abierta y a Distancia (UNAD)
              </p>
            </div>

            <AcademicTeamCards />
          </div>
        </section>

        {/* Compromiso con el impacto global (ODS) */}
        <section className="py-20 bg-white">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div className="max-w-2xl">
                <h2 className="text-3xl md:text-5xl font-display font-bold text-primary-dark mb-4 text-balance">
                  Compromiso con el impacto global
                </h2>
                <p className="text-gray-soft-300">
                  Alineamos nuestra misión con los Objetivos de Desarrollo Sostenible de la ONU para crear un futuro
                  más equitativo y próspero.
                </p>
              </div>
              <span className="material-symbols-outlined hidden md:block text-6xl text-primary-dark/10">public</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {ODS_GOALS.map((goal) => (
                <div
                  key={goal.num}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-soft-200 hover:shadow-md transition-shadow"
                >
                  <div className="h-2 w-full" style={{ backgroundColor: goal.color }} />
                  <div className="p-6">
                    <div className="text-3xl font-bold mb-2" style={{ color: goal.color }}>
                      {goal.num}
                    </div>
                    <h4 className="text-lg font-display font-semibold text-primary-dark mb-3">{goal.title}</h4>
                    <p className="text-sm text-gray-soft-300">{goal.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Nuestra Madurez Tecnológica (TRL) */}
        <section className="py-20 bg-primary-dark text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-cyan/20 blur-[100px]" />
          <div className="container-custom relative z-10">
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 text-balance">
                Nuestra Madurez Tecnológica (TRL)
              </h2>
              <p className="opacity-80">
                Estamos construyendo una plataforma sólida, escalando desde la validación teórica hasta la
                implementación real.
              </p>
            </div>

            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10">
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-10 h-10 rounded-full bg-white text-primary-dark font-bold flex items-center justify-center">
                    4
                  </span>
                  <span className="text-[#44ddc1] text-sm font-semibold tracking-wide">TRL 4 · ACTUAL</span>
                </div>
                <h3 className="text-xl font-display font-bold mb-4">Prototipo Validado</h3>
                <p className="opacity-80 leading-relaxed">
                  Componentes tecnológicos integrados y validados en entorno de laboratorio. Estructura de
                  credenciales definida.
                </p>
              </div>
              <div className="bg-primary-cyan/10 backdrop-blur-md p-8 rounded-2xl border border-primary-cyan/20">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-10 h-10 rounded-full bg-primary-cyan text-white font-bold flex items-center justify-center">
                    5
                  </span>
                  <span className="text-[#44ddc1] text-sm font-semibold tracking-wide">TRL 5 · PRÓXIMAMENTE</span>
                </div>
                <h3 className="text-xl font-display font-bold mb-4">Validación Relevante</h3>
                <p className="opacity-80 leading-relaxed">
                  Despliegue del MVP en entornos operativos reales con empresas colaboradoras y grupos piloto de
                  jóvenes.
                </p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Button variant="secondary" onClick={() => navigate("/contacto")}>
                Ver Hoja de Ruta Detallada
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-white">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto bg-gray-soft-50 rounded-[2.5rem] p-10 md:p-16 text-center relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-cyan/10 rounded-full" />
              <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-display font-bold text-primary-dark mb-6 text-balance">
                  ¿Listo para dar el primer paso?
                </h2>
                <p className="text-lg text-gray-soft-300 mb-10 max-w-2xl mx-auto">
                  Únete a la comunidad MPED y empieza a construir tu futuro profesional hoy mismo.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="primary" size="lg" onClick={() => navigate("/onboarding")}>
                    Crear mi Perfil
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => navigate("/contacto")}>
                    Saber más
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Landing
