import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/common/Button'

const Onboarding = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const navigate = useNavigate()

  const slides = [
    {
      title: '¡Bienvenido a MPED!',
      description: 'Tu plataforma para encontrar microempleos que impulsen tu carrera profesional',
      icon: '👋',
      content: (
        <div className="text-center">
          <div className="text-8xl mb-8">👋</div>
          <p className="text-lg text-gray-soft-200">
            Conectamos jóvenes talentosos con oportunidades de trabajo flexibles
          </p>
        </div>
      )
    },
    {
      title: '¿Qué ofrece la plataforma?',
      description: 'Descubre todas las ventajas de ser parte de MPED',
      icon: '✨',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-4xl mb-3">💼</div>
            <h3 className="font-semibold text-primary-dark mb-2">Microempleos</h3>
            <p className="text-sm text-gray-soft-200">Trabajos flexibles adaptados a tu horario</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-4xl mb-3">🏆</div>
            <h3 className="font-semibold text-primary-dark mb-2">Credenciales</h3>
            <p className="text-sm text-gray-soft-200">Valida tus habilidades con credenciales digitales</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-4xl mb-3">⭐</div>
            <h3 className="font-semibold text-primary-dark mb-2">Calificaciones</h3>
            <p className="text-sm text-gray-soft-200">Construye tu reputación profesional</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-4xl mb-3">📱</div>
            <h3 className="font-semibold text-primary-dark mb-2">Fácil de usar</h3>
            <p className="text-sm text-gray-soft-200">Plataforma intuitiva y accesible</p>
          </div>
        </div>
      )
    },
    {
      title: '¿Cómo funciona?',
      description: 'Solo necesitas 4 pasos para comenzar',
      icon: '🚀',
      content: (
        <div className="space-y-6 mt-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-primary-cyan rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
              1
            </div>
            <div>
              <h3 className="font-semibold text-primary-dark mb-1">Regístrate con tu teléfono</h3>
              <p className="text-sm text-gray-soft-200">Crea tu cuenta en segundos</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-primary-cyan rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
              2
            </div>
            <div>
              <h3 className="font-semibold text-primary-dark mb-1">Completa tu perfil</h3>
              <p className="text-sm text-gray-soft-200">Añade tus habilidades, disponibilidad e intereses</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-primary-cyan rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
              3
            </div>
            <div>
              <h3 className="font-semibold text-primary-dark mb-1">Explora ofertas</h3>
              <p className="text-sm text-gray-soft-200">Encuentra trabajos que se adapten a ti</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-primary-cyan rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
              4
            </div>
            <div>
              <h3 className="font-semibold text-primary-dark mb-1">Postúlate y trabaja</h3>
              <p className="text-sm text-gray-soft-200">Gana experiencia y construye tu portafolio</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: '¡Comencemos!',
      description: 'Elige cómo quieres registrarte',
      icon: '🎯',
      content: (
        <div className="mt-8 space-y-4">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => navigate('/auth/young/register')}
          >
            Registrarme como joven
          </Button>
          <Button
            variant="outline"
            size="lg"
            fullWidth
            onClick={() => navigate('/auth/employer/register')}
          >
            Registrarme como empleador
          </Button>
          <div className="text-center mt-6">
            <button
              onClick={() => navigate('/login')}
              className="text-primary-cyan hover:underline"
            >
              Ya tengo cuenta, iniciar sesión
            </button>
          </div>
        </div>
      )
    }
  ]

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  const finalSlideIndex = slides.length - 1
  const goToFinalSlide = () => setCurrentSlide(finalSlideIndex)
  const showSkipControls = currentSlide < finalSlideIndex

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-dark to-primary-dark/90 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 md:p-12">
        {showSkipControls && (
          <button
            type="button"
            onClick={goToFinalSlide}
            className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full text-primary-dark hover:bg-gray-soft-100 transition-colors"
            aria-label="Ir al último paso"
          >
            <span className="text-2xl leading-none" aria-hidden>
              ×
            </span>
          </button>
        )}
        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-8">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`
                w-2 h-2 rounded-full transition-all duration-200
                ${index === currentSlide 
                  ? 'bg-primary-cyan w-8' 
                  : 'bg-gray-soft-200'
                }
              `}
            />
          ))}
        </div>

        {/* Slide Content */}
        <div className="min-h-[400px] flex flex-col">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-primary-dark mb-4">
              {slides[currentSlide].title}
            </h1>
            <p className="text-gray-soft-200">
              {slides[currentSlide].description}
            </p>
          </div>

          <div className="flex-grow flex items-center justify-center">
            {slides[currentSlide].content}
          </div>

          {/* Navigation Buttons */}
          {showSkipControls && (
            <>
              <div className="flex justify-between mt-8">
                <Button
                  variant="ghost"
                  onClick={prevSlide}
                  disabled={currentSlide === 0}
                >
                  Atrás
                </Button>
                <Button
                  variant="primary"
                  onClick={nextSlide}
                >
                  Siguiente
                </Button>
              </div>
              <div className="text-center mt-6">
                <button
                  type="button"
                  onClick={goToFinalSlide}
                  className="text-sm text-gray-soft-200 hover:text-primary-cyan underline-offset-2 hover:underline"
                >
                  Omitir
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Onboarding
