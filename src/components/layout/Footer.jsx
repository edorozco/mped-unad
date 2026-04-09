import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-primary-dark text-white mt-auto">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-display font-bold mb-4">MPED</h3>
            <p className="text-white/70 text-sm">
              Conectando jóvenes con su primer empleo digital
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Para Jóvenes</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link to="/home" className="hover:text-white transition-colors">Buscar Trabajos</Link></li>
              <li><Link to="/credentials" className="hover:text-white transition-colors">Microcredenciales</Link></li>
              <li><Link to="/onboarding" className="hover:text-white transition-colors">¿Cómo funciona?</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Para Empleadores</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link to="/auth/employer/register" className="hover:text-white transition-colors">Registrarse</Link></li>
              <li><Link to="/employer/dashboard" className="hover:text-white transition-colors">Publicar Oferta</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Soporte</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><a href="#" className="hover:text-white transition-colors">Ayuda</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Términos y Condiciones</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/15 mt-8 pt-8 text-center text-sm text-white/55">
          <p>&copy; 2024 Mi Primer Empleo Digital. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
