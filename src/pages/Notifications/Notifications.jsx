import { useMemo, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import Header from '../../components/layout/Header'
import Sidebar from '../../components/layout/Sidebar'
import Navigation from '../../components/layout/Navigation'
import demoNotifications from '../../data/demoNotifications.json'

const TYPE_META = {
  application_accepted: { icon: 'work', className: 'bg-primary-cyan/15 text-primary-dark', category: 'empleos' },
  reminder: { icon: 'schedule', className: 'bg-accent-gold/15 text-accent-gold', category: 'empleos' },
  rating_received: { icon: 'star', className: 'bg-accent-gold/15 text-accent-gold', category: 'calificaciones' },
  credential_earned: { icon: 'military_tech', className: 'bg-primary-cyan/25 text-primary-dark', category: 'credenciales' },
  new_job: { icon: 'auto_awesome', className: 'bg-gray-soft-100 text-primary-dark', category: 'empleos' },
}

const TABS = [
  { value: '', label: 'Todas' },
  { value: 'empleos', label: 'Empleos' },
  { value: 'credenciales', label: 'Credenciales' },
  { value: 'calificaciones', label: 'Calificaciones' },
]

const isToday = (dateStr) => new Date(dateStr).toDateString() === new Date().toDateString()

const NotificationCard = ({ notification, onOpen }) => {
  const meta = TYPE_META[notification.type] || TYPE_META.new_job
  return (
    <div
      onClick={() => onOpen(notification)}
      className={`group relative bg-white border border-gray-soft-200 rounded-xl p-4 flex gap-4 hover:shadow-lg hover:border-primary-cyan transition-all cursor-pointer ${
        notification.read ? 'opacity-70' : ''
      }`}
    >
      <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${meta.className}`}>
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
          {meta.icon}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-3 mb-1">
          <p className="text-sm text-primary-dark leading-tight">
            <span className="font-semibold">{notification.title}</span>
          </p>
          {!notification.read && <span className="w-2 h-2 rounded-full bg-primary-cyan mt-1.5 flex-shrink-0" />}
        </div>
        <p className="text-sm text-gray-soft-300 leading-tight">{notification.message}</p>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-xs text-gray-soft-300">
            {new Date(notification.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
          </span>
          {notification.jobId && (
            <a
              href={`/offer/${notification.jobId}`}
              onClick={(e) => e.stopPropagation()}
              className="text-xs font-bold text-primary-cyan hover:underline"
            >
              Ver oferta
            </a>
          )}
          {notification.credentialId && (
            <a
              href={`/credentials/${notification.credentialId}`}
              onClick={(e) => e.stopPropagation()}
              className="text-xs font-bold text-primary-cyan hover:underline"
            >
              Ver credencial
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

const Notifications = () => {
  const { user, isAuthenticated } = useAuth()
  const showSidebar = isAuthenticated && user?.role === 'young'
  const [notifications, setNotifications] = useState(demoNotifications)
  const [activeTab, setActiveTab] = useState('')

  const markAsRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  const filtered = useMemo(() => {
    if (!activeTab) return notifications
    return notifications.filter((n) => (TYPE_META[n.type]?.category || 'empleos') === activeTab)
  }, [notifications, activeTab])

  const todayItems = filtered.filter((n) => isToday(n.date)).sort((a, b) => new Date(b.date) - new Date(a.date))
  const previousItems = filtered.filter((n) => !isToday(n.date)).sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <div className="min-h-screen bg-gray-soft-50 pb-20 md:pb-0">
      <Header />
      {showSidebar && <Sidebar />}
      <div className={showSidebar ? 'md:ml-64' : ''}>
        <div className="container-custom py-8 max-w-3xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h1 className="text-2xl md:text-3xl font-display font-bold text-primary-dark">
              Notificaciones {unreadCount > 0 && <span className="text-primary-cyan">({unreadCount})</span>}
            </h1>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="flex items-center gap-2 text-sm font-semibold text-primary-cyan hover:underline"
              >
                <span className="material-symbols-outlined text-lg">done_all</span>
                Marcar todo como leído
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
            {TABS.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setActiveTab(tab.value)}
                className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                  activeTab === tab.value
                    ? 'bg-primary-dark text-white'
                    : 'bg-gray-soft-100 text-gray-soft-300 hover:bg-gray-soft-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {filtered.length > 0 ? (
            <div className="flex flex-col gap-8">
              {todayItems.length > 0 && (
                <section>
                  <h3 className="text-xs font-bold text-gray-soft-300 uppercase tracking-wider mb-4">Hoy</h3>
                  <div className="flex flex-col gap-3">
                    {todayItems.map((n) => (
                      <NotificationCard key={n.id} notification={n} onOpen={(notif) => markAsRead(notif.id)} />
                    ))}
                  </div>
                </section>
              )}
              {previousItems.length > 0 && (
                <section>
                  <h3 className="text-xs font-bold text-gray-soft-300 uppercase tracking-wider mb-4">Anterior</h3>
                  <div className="flex flex-col gap-3">
                    {previousItems.map((n) => (
                      <NotificationCard key={n.id} notification={n} onOpen={(notif) => markAsRead(notif.id)} />
                    ))}
                  </div>
                </section>
              )}
            </div>
          ) : (
            <div className="bg-white border border-dashed border-gray-soft-200 rounded-xl p-12 text-center">
              <span className="material-symbols-outlined text-5xl text-gray-soft-300 mb-4">notifications_off</span>
              <h3 className="text-lg font-display font-bold text-primary-dark mb-2">No tienes notificaciones</h3>
              <p className="text-gray-soft-300">Te avisaremos cuando haya novedades sobre tus aplicaciones o logros.</p>
            </div>
          )}
        </div>
      </div>
      <Navigation />
    </div>
  )
}

export default Notifications
