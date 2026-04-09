"use client"

import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import Button from "../common/Button"

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
  }

  return (
    <header className="bg-white border-b border-[#333]/20 sticky top-0 z-40 shadow-sm">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary-cyan rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-display font-bold text-lg">M</span>
            </div>
            <h1 className="text-2xl font-display font-bold text-primary-dark group-hover:text-primary-cyan transition-colors">
              MPED
            </h1>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/empleos"
              className="text-primary-dark hover:text-primary-cyan transition-colors font-medium"
            >
              Buscar empleos
            </Link>
            {isAuthenticated ? (
              <>
                {user?.role === "employer" && (
                  <Link
                    to="/employer/dashboard"
                    className="text-primary-dark hover:text-primary-cyan transition-colors font-medium"
                  >
                    Panel
                  </Link>
                )}
                <Link
                  to="/credentials"
                  className="text-primary-dark hover:text-primary-cyan transition-colors font-medium"
                >
                  Credenciales
                </Link>
                <Link
                  to="/notifications"
                  className="text-primary-dark hover:text-primary-cyan transition-colors font-medium relative"
                >
                  Notificaciones
                </Link>
                <div className="flex items-center gap-3 pl-4 border-l border-[#333]/20">
                  <div className="text-right">
                    <p className="text-sm font-medium text-primary-dark">{user?.name}</p>
                    <p className="text-xs text-[#333] capitalize">{user?.role}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    Salir
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/onboarding"
                  className="text-primary-dark hover:text-primary-cyan transition-colors font-medium"
                >
                  ¿Cómo funciona?
                </Link>
                <Button variant="outline" size="sm" onClick={() => navigate("/login")}>
                  Iniciar sesión
                </Button>
                <Button variant="primary" size="sm" onClick={() => navigate("/auth/young/register")}>
                  Registrarse
                </Button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
