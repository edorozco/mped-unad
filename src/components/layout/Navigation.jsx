import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const Navigation = () => {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) return null

  const isActive = (path) => location.pathname === path

  const navItems = user?.role === 'young' ? [
    { path: '/empleos', icon: '🏠', label: 'Inicio' },
    { path: '/credentials', icon: '🏆', label: 'Credenciales' },
    { path: '/ratings', icon: '⭐', label: 'Calificaciones' },
    { path: '/notifications', icon: '🔔', label: 'Notificaciones' },
  ] : [
    { path: '/employer/dashboard', icon: '📊', label: 'Panel' },
    { path: '/employer/create-job', icon: '➕', label: 'Crear' },
    { path: '/notifications', icon: '🔔', label: 'Notificaciones' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-soft-100 md:hidden z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`
              flex flex-col items-center justify-center flex-1 h-full
              transition-colors duration-200
              ${isActive(item.path) 
                ? 'text-primary-cyan' 
                : 'text-[#333]'
              }
            `}
          >
            <span className="text-2xl mb-1">{item.icon}</span>
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}

export default Navigation
