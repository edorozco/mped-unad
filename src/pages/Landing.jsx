"use client"
import { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { useJobs } from "../contexts/JobsContext"
import Header from "../components/layout/Header"
import Button from "../components/common/Button"
import JobCard from "../components/jobs/JobCard"
import AcademicTeamCards from "../components/academic/AcademicTeamCards"

const Landing = () => {
  const navigate = useNavigate()
  const { jobs } = useJobs()

  const publishedVacancies = useMemo(() => {
    return [...jobs]
      .filter((j) => j.status === "active")
      .sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured))
      .slice(0, 6)
  }, [jobs])

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow">
        {/* Hero Section - Enhanced */}
        <section className="relative overflow-hidden bg-primary-dark text-white py-24 md:py-40">
          <div className="absolute inset-0 opacity-[0.12] pointer-events-none">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-primary-cyan rounded-full mix-blend-screen filter blur-3xl" />
            <div className="absolute bottom-0 -right-4 w-80 h-80 bg-primary-cyan/60 rounded-full mix-blend-screen filter blur-3xl" />
          </div>

          <div className="container-custom relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 text-balance leading-tight">
                Tu Primer Empleo Digital
              </h1>
              <p className="text-xl md:text-2xl text-white/85 mb-10 text-balance">
                Conectamos jóvenes talentosos con oportunidades de trabajo que impulsan su futuro profesional
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="primary" size="lg" onClick={() => navigate("/onboarding")}>
                  Comenzar ahora
                </Button>
                <Button variant="outlineLight" size="lg" onClick={() => navigate("/auth/employer/register")}>
                  Soy empleador
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gray-soft-50 border-b border-gray-soft-200">
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-display font-bold text-primary-dark mb-2">2.500+</p>
                <p className="text-sm text-gray-soft-300">Jóvenes empleados</p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-display font-bold text-primary-dark mb-2">890+</p>
                <p className="text-sm text-gray-soft-300">Empresas activas</p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-display font-bold text-primary-dark mb-2">$2.3M</p>
                <p className="text-sm text-gray-soft-300">Pagado a trabajadores</p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-display font-bold text-primary-dark mb-2">4.8★</p>
                <p className="text-sm text-gray-soft-300">Calificación promedio</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container-custom">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-center text-primary-dark mb-16 text-balance">
              ¿Qué ofrecemos?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group relative p-8 rounded-2xl bg-gray-soft-50 hover:bg-white hover:shadow-lg transition-all duration-300 border border-gray-soft-200">
                <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  💼
                </div>
                <h3 className="text-2xl font-display font-semibold text-primary-dark mb-3">Microempleos Flexibles</h3>
                <p className="text-gray-soft-300 leading-relaxed">
                  Trabajos de corta duración que se adaptan a tu disponibilidad, horarios y habilidades
                </p>
              </div>

              <div className="group relative p-8 rounded-2xl bg-gray-soft-50 hover:bg-white hover:shadow-lg transition-all duration-300 border border-gray-soft-200">
                <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  🏆
                </div>
                <h3 className="text-2xl font-display font-semibold text-primary-dark mb-3">Microcredenciales</h3>
                <p className="text-gray-soft-300 leading-relaxed">
                  Gana credenciales digitales verificadas que validan tus habilidades ante futuros empleadores
                </p>
              </div>

              <div className="group relative p-8 rounded-2xl bg-gray-soft-50 hover:bg-white hover:shadow-lg transition-all duration-300 border border-gray-soft-200">
                <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  ⭐
                </div>
                <h3 className="text-2xl font-display font-semibold text-primary-dark mb-3">Calificaciones</h3>
                <p className="text-gray-soft-300 leading-relaxed">
                  Construye tu reputación profesional con calificaciones auténticas de empleadores
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="py-20 bg-gray-soft-50">
          <div className="container-custom">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-center text-primary-dark mb-16 text-balance">
              ¿Cómo funciona?
            </h2>
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { num: 1, title: "Regístrate", desc: "Crea tu perfil profesional en minutos" },
                  { num: 2, title: "Completa tu perfil", desc: "Añade tus habilidades e intereses" },
                  { num: 3, title: "Encuentra trabajos", desc: "Explora ofertas que se adaptan a ti" },
                  { num: 4, title: "Gana credenciales", desc: "Construye tu portafolio profesional" },
                ].map((step) => (
                  <div key={step.num} className="text-center relative">
                    <div className="w-20 h-20 bg-primary-cyan rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">
                      {step.num}
                    </div>
                    <h3 className="font-display font-semibold text-primary-dark mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-soft-300">{step.desc}</p>
                    {step.num < 4 && (
                      <div className="hidden md:block absolute top-10 right-0 transform translate-x-1/2 w-full h-0.5 bg-primary-cyan/35" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-white">
          <div className="container-custom">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-center text-primary-dark mb-16 text-balance">
              Lo que dicen nuestros usuarios
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  quote:
                    "Encontré mi primer trabajo gracias a MPED. La plataforma es muy fácil de usar y los empleadores son confiables.",
                  author: "María G., 19 años",
                  role: "Estudiante",
                },
                {
                  quote:
                    "Como empleador, MPED me ha ayudado a encontrar jóvenes talentosos y comprometidos para nuestros proyectos.",
                  author: "Carlos R.",
                  role: "Empleador",
                },
                {
                  quote:
                    "Las microcredenciales me han ayudado a demostrar mis habilidades a futuros empleadores de manera clara.",
                  author: "Ana M., 21 años",
                  role: "Universitaria",
                },
              ].map((testimonial, idx) => (
                <div
                  key={idx}
                  className="relative p-8 rounded-2xl bg-gradient-to-br from-gray-soft-50 to-white border border-gray-soft-200 shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-0.5 mb-4 text-accent-gold text-lg" aria-hidden>
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <p className="text-gray-soft-300 mb-6 leading-relaxed italic">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-display font-semibold text-primary-dark">{testimonial.author}</p>
                    <p className="text-sm text-gray-soft-300">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Vacantes publicadas */}
        <section className="py-20 bg-gray-soft-50 border-t border-gray-soft-200">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-primary-dark mb-4 text-balance">
                Trabajos y vacantes publicadas
              </h2>
              <p className="text-lg text-gray-soft-300 max-w-2xl mx-auto">
                Oportunidades reales de empresas en la plataforma. Explora el listado o abre una vacante para ver el detalle.
              </p>
            </div>
            {publishedVacancies.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                  {publishedVacancies.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
                <div className="text-center">
                  <Button variant="outline" size="lg" onClick={() => navigate("/empleos")}>
                    Ver todas las vacantes
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-center text-gray-soft-300">
                Pronto podrás ver aquí las vacantes publicadas.
              </p>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative overflow-hidden py-20 bg-primary-cyan text-white">
          <div className="container-custom text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-balance">¿Listo para comenzar?</h2>
            <p className="text-xl text-white/95 mb-10 max-w-2xl mx-auto">
              Únete a miles de jóvenes que ya están construyendo su futuro profesional
            </p>
            <Button variant="secondary" size="lg" onClick={() => navigate("/onboarding")}>
              Comenzar ahora
            </Button>
          </div>
        </section>

        {/* Nuestro equipo — proyecto académico */}
        <section className="py-20 bg-white border-t border-gray-soft-200">
          <div className="container-custom">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-primary-dark mb-4 text-balance">
                Nuestro equipo
              </h2>
              <p className="text-lg text-gray-soft-300 leading-relaxed">
                Proyecto de Ingeniería II · Universidad Nacional Abierta y a Distancia (UNAD)
              </p>
            </div>

            <AcademicTeamCards />
          </div>
        </section>
      </main>
    </div>
  )
}

export default Landing
