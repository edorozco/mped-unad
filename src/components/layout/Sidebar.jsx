import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useUser } from '../../contexts/UserContext'

const SIDEBAR_LINKS = [
  { icon: 'dashboard', label: 'Inicio', path: '/home' },
  { icon: 'person', label: 'Perfil', path: '/profile/young' },
  { icon: 'psychology', label: 'Test Vocacional', path: '/test-vocacional' },
  { icon: 'work', label: 'Empleos', path: '/empleos' },
  { icon: 'history', label: 'Postulaciones', path: '/postulaciones' },
  { icon: 'school', label: 'Cursos', path: '/cursos' },
  { icon: 'military_tech', label: 'Credenciales', path: '/credentials' },
  { icon: 'star', label: 'Calificaciones', path: '/ratings' },
  { icon: 'notifications', label: 'Notificaciones', path: '/notifications' },
]

/** Sidebar de navegación para los módulos del joven (desktop only; en mobile ya existe la barra inferior) */
const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAuthenticated, logout } = useAuth()
  const { profile } = useUser()

  if (!isAuthenticated || user?.role !== 'young') {
    return null
  }

  return (
    <aside className="hidden md:flex md:flex-col md:fixed md:left-0 md:top-16 md:h-[calc(100vh-4rem)] md:w-64 bg-white border-r border-gray-soft-200 p-4 gap-2 z-30">
      <div className="flex items-center gap-3 px-2 py-3 mb-4 border-b border-gray-soft-200 pb-4">
        <div className="w-10 h-10 rounded-full bg-primary-cyan/15 flex items-center justify-center overflow-hidden flex-shrink-0">
          {profile?.photo ? (
            <img src={profile.photo} alt={profile?.name} className="w-full h-full object-cover" />
          ) : (
            <span className="material-symbols-outlined text-primary-dark">person</span>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-primary-dark truncate">{profile?.name || user?.name || 'Joven'}</p>
          <p className="text-xs text-gray-soft-300">Joven</p>
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

export default Sidebar
