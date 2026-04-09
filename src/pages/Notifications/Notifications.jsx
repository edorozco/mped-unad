import { useState } from 'react'
import Header from '../../components/layout/Header'
import Navigation from '../../components/layout/Navigation'
import Card from '../../components/common/Card'
import demoNotifications from '../../data/demoNotifications.json'

const Notifications = () => {
  const [notifications, setNotifications] = useState(demoNotifications)
  const [selectedNotification, setSelectedNotification] = useState(null)

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
  }

  const unreadCount = notifications.filter(n => !n.read).length

  const getNotificationIcon = (type) => {
    const icons = {
      application_accepted: '✅',
      reminder: '⏰',
      rating_received: '⭐',
      credential_earned: '🏆',
      new_job: '💼'
    }
    return icons[type] || '🔔'
  }

  const getNotificationTitle = (type) => {
    const titles = {
      application_accepted: 'Postulación aceptada',
      reminder: 'Recordatorio',
      rating_received: 'Nueva calificación',
      credential_earned: 'Credencial obtenida',
      new_job: 'Nueva oferta'
    }
    return titles[type] || 'Notificación'
  }

  return (
    <div className="min-h-screen bg-gray-soft-50 pb-20 md:pb-0">
      <Header />
      <div className="container-custom py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-display font-bold text-primary-dark">
            Notificaciones
          </h1>
          {unreadCount > 0 && (
            <span className="bg-primary-cyan text-white text-sm font-semibold px-3 py-1 rounded-full">
              {unreadCount} {unreadCount === 1 ? 'sin leer' : 'sin leer'}
            </span>
          )}
        </div>

        <div className="space-y-3">
          {notifications.length > 0 ? (
            notifications.map(notification => (
              <Card
                key={notification.id}
                hover
                onClick={() => {
                  setSelectedNotification(notification)
                  markAsRead(notification.id)
                }}
                className={!notification.read ? 'border-l-4 border-primary-cyan' : ''}
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold text-primary-dark">
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <span className="w-2 h-2 bg-primary-cyan rounded-full flex-shrink-0 mt-2"></span>
                      )}
                    </div>
                    <p className="text-sm text-gray-soft-200 mb-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-soft-200">
                      {new Date(notification.date).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card>
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔔</div>
                <h3 className="text-xl font-semibold text-primary-dark mb-2">
                  No tienes notificaciones
                </h3>
                <p className="text-gray-soft-200">
                  Te notificaremos cuando tengas nuevas actualizaciones
                </p>
              </div>
            </Card>
          )}
        </div>

        {/* Notification Detail Modal */}
        {selectedNotification && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedNotification(null)}
          >
            <Card
              className="max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="text-5xl flex-shrink-0">
                  {getNotificationIcon(selectedNotification.type)}
                </div>
                <div className="flex-grow">
                  <h2 className="text-2xl font-display font-bold text-primary-dark mb-2">
                    {selectedNotification.title}
                  </h2>
                  <p className="text-sm text-gray-soft-200 mb-4">
                    {new Date(selectedNotification.date).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedNotification(null)}
                  className="text-gray-soft-200 hover:text-primary-dark"
                >
                  ✕
                </button>
              </div>
              <p className="text-gray-soft-200 leading-relaxed mb-6">
                {selectedNotification.message}
              </p>
              <div className="flex gap-3">
                {selectedNotification.jobId && (
                  <a
                    href={`/offer/${selectedNotification.jobId}`}
                    className="flex-1 text-center px-4 py-2 bg-primary-cyan text-white rounded-lg hover:bg-opacity-90 transition-colors"
                  >
                    Ver oferta
                  </a>
                )}
                {selectedNotification.credentialId && (
                  <a
                    href="/credentials"
                    className="flex-1 text-center px-4 py-2 bg-primary-cyan text-white rounded-lg hover:bg-opacity-90 transition-colors"
                  >
                    Ver credencial
                  </a>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
      <Navigation />
    </div>
  )
}

export default Notifications
