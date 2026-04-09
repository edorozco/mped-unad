import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/layout/Header'
import Navigation from '../../components/layout/Navigation'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import StarRating from '../../components/common/StarRating'
import Input from '../../components/common/Input'
import Modal from '../../components/common/Modal'

const Ratings = () => {
  const [showRateForm, setShowRateForm] = useState(false)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [viewMode, setViewMode] = useState('history') // 'rate' or 'history'

  // Mock ratings history
  const ratingsHistory = [
    {
      id: 1,
      jobTitle: 'Asistente de ventas en tienda',
      company: 'Moda Express',
      rating: 5,
      comment: 'Excelente trabajo, muy puntual y profesional.',
      date: '2024-02-10',
      from: 'Moda Express'
    },
    {
      id: 2,
      jobTitle: 'Repartidor de comida rápida',
      company: 'Delicias Express',
      rating: 4,
      comment: 'Buen desempeño, recomendado.',
      date: '2024-02-05',
      from: 'Delicias Express'
    }
  ]

  const handleRate = (value) => {
    setRating(value)
  }

  const handleSubmitRating = (e) => {
    e.preventDefault()
    // Simulate rating submission
    setShowRateForm(false)
    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
      setRating(0)
      setComment('')
      setViewMode('history')
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-soft-50 pb-20 md:pb-0">
      <Header />
      <div className="container-custom py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-display font-bold text-primary-dark">
            Calificaciones
          </h1>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'history' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('history')}
            >
              Historial
            </Button>
            <Button
              variant={viewMode === 'rate' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => {
                setViewMode('rate')
                setShowRateForm(true)
              }}
            >
              Calificar trabajo
            </Button>
          </div>
        </div>

        {viewMode === 'rate' && (
          <Card>
            <h2 className="text-xl font-semibold text-primary-dark mb-6">
              Calificar trabajo completado
            </h2>
            <form onSubmit={handleSubmitRating} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-primary-dark mb-3">
                  Calificación
                </label>
                <div className="flex justify-center">
                  <StarRating
                    rating={rating}
                    onRate={handleRate}
                    interactive
                    size="lg"
                  />
                </div>
                {rating > 0 && (
                  <p className="text-center text-sm text-gray-soft-200 mt-2">
                    {rating} {rating === 1 ? 'estrella' : 'estrellas'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-dark mb-2">
                  Comentario (opcional)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Comparte tu experiencia..."
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-soft-200 focus:outline-none focus:ring-2 focus:ring-primary-cyan focus:border-transparent"
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  fullWidth
                  onClick={() => {
                    setViewMode('history')
                    setRating(0)
                    setComment('')
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  disabled={rating === 0}
                >
                  Enviar calificación
                </Button>
              </div>
            </form>
          </Card>
        )}

        {viewMode === 'history' && (
          <div className="space-y-4">
            {ratingsHistory.length > 0 ? (
              ratingsHistory.map(rating => (
                <Card key={rating.id}>
                  <div className="flex items-start justify-between">
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-primary-dark">
                          {rating.jobTitle}
                        </h3>
                        <StarRating rating={rating.rating} size="sm" />
                      </div>
                      <p className="text-sm text-gray-soft-200 mb-2">
                        {rating.company} • {new Date(rating.date).toLocaleDateString('es-ES')}
                      </p>
                      {rating.comment && (
                        <p className="text-gray-soft-200 mt-2">{rating.comment}</p>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card>
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">⭐</div>
                  <h3 className="text-xl font-semibold text-primary-dark mb-2">
                    Aún no tienes calificaciones
                  </h3>
                  <p className="text-gray-soft-200">
                    Completa trabajos para recibir calificaciones de empleadores
                  </p>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Success Modal */}
        <Modal
          isOpen={showSuccess}
          onClose={() => setShowSuccess(false)}
          title="Calificación enviada"
        >
          <div className="text-center py-6">
            <div className="text-6xl mb-6">✅</div>
            <p className="text-lg text-gray-soft-200">
              Tu calificación ha sido enviada exitosamente.
            </p>
          </div>
        </Modal>
      </div>
      <Navigation />
    </div>
  )
}

export default Ratings
