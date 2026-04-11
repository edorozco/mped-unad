import { Link } from "react-router-dom"
import Header from "../components/layout/Header"
import AcademicTeamCards from "../components/academic/AcademicTeamCards"

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-soft-50">
      <Header />
      <main className="flex-grow">
        <section className="bg-primary-dark text-white py-14 md:py-20">
          <div className="container-custom">
            <p className="text-sm text-white/75 mb-2">
              <Link to="/" className="hover:text-white transition-colors">
                Inicio
              </Link>
              <span className="mx-2">/</span>
              <span className="text-white">Contacto</span>
            </p>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-balance">Nuestro equipo</h1>
            <p className="mt-4 text-lg text-white/85 max-w-2xl text-balance leading-relaxed">
              Proyecto de Ingeniería II · Universidad Nacional Abierta y a Distancia (UNAD)
            </p>
          </div>
        </section>

        <section className="py-20 bg-white border-t border-gray-soft-200">
          <div className="container-custom">
            <AcademicTeamCards />
          </div>
        </section>
      </main>
    </div>
  )
}

export default Contact
