import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const SIDEBAR_LINKS = [
  { icon: 'dashboard', label: 'Inicio', path: '/employer/dashboard' },
  { icon: 'add_circle', label: 'Publicar oferta', path: '/employer/create-job' },
]

/** Sidebar de navegación para el panel de empresa/empleador (desktop only) */
const EmployerSidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAuthenticated, logout } = useAuth()

  if (!isAuthenticated || user?.role !== 'employer') {
    return null
  }

  const displayName = user?.businessName || user?.name || 'Empresa'
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('')

  return (
    <aside className="hidden md:flex md:flex-col md:fixed md:left-0 md:top-16 md:h-[calc(100vh-4rem)] md:w-64 bg-white border-r border-gray-soft-200 p-4 gap-2 z-30">
      <div className="flex items-center gap-3 px-2 py-3 mb-4 border-b border-gray-soft-200 pb-4">
        <div className="w-10 h-10 rounded-full bg-primary-cyan/15 flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-bold text-primary-dark">{initials}</span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-primary-dark truncate">{displayName}</p>
          <p className="text-xs text-gray-soft-300">Empresa</p>
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-1">
        {SIDEBAR_LINKS.map((link) => {
          const isActive = location.pathname === link.path || location.pathname.startsWith(`${link.path}/`)
          return (
            <button
              key={link.path}
              type="button"
              onClick={() => navigate(link.path)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-cyan/15 text-primary-dark'
                  : 'text-gray-soft-300 hover:bg-gray-soft-50 hover:text-primary-dark'
              }`}
            >
              <span className="material-symbols-outlined text-xl">{link.icon}</span>
              {link.label}
            </button>
          )
        })}
      </nav>

      <div className="border-t border-gray-soft-200 pt-4">
        <button
          type="button"
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors w-full"
        >
          <span className="material-symbols-outlined text-xl">logout</span>
          Salir
        </button>
      </div>
    </aside>
  )
}

export default EmployerSidebar
