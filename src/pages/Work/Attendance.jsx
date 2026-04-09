import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useJobs } from '../../contexts/JobsContext'
import Header from '../../components/layout/Header'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'

const Attendance = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getJobById } = useJobs()
  const [step, setStep] = useState(1) // 1: check-in, 2: check-out, 3: summary
  const [checkInTime, setCheckInTime] = useState(null)
  const [checkOutTime, setCheckOutTime] = useState(null)

  const job = getJobById(id)

  const handleCheckIn = () => {
    setCheckInTime(new Date())
    setStep(2)
  }

  const handleCheckOut = () => {
    setCheckOutTime(new Date())
    setStep(3)
  }

  const calculateHours = () => {
    if (checkInTime && checkOutTime) {
      const diff = checkOutTime - checkInTime
      const hours = diff / (1000 * 60 * 60)
      return hours.toFixed(2)
    }
    return 0
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-soft-50">
        <Header />
        <div className="container-custom py-12 text-center">
          <h2 className="text-2xl font-bold text-primary-dark mb-4">Trabajo no encontrado</h2>
          <Button onClick={() => navigate('/home')}>Volver</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-soft-50 pb-20 md:pb-0">
      <Header />
      <div className="container-custom py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/home')}
          className="mb-6"
        >
          ← Volver
        </Button>

        <Card>
          <div className="text-center mb-8">
            <h1 className="text-2xl font-display font-bold text-primary-dark mb-2">
              {job.title}
            </h1>
            <p className="text-gray-soft-200">{job.company}</p>
          </div>

          {step === 1 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-6">📍</div>
              <h2 className="text-xl font-semibold text-primary-dark mb-4">
                Registro de entrada
              </h2>
              <p className="text-gray-soft-200 mb-8">
                Confirma que has llegado al lugar de trabajo
              </p>
              <Button
                variant="primary"
                size="lg"
                onClick={handleCheckIn}
              >
                Hacer Check-in
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-6">✅</div>
              <h2 className="text-xl font-semibold text-primary-dark mb-4">
                Check-in realizado
              </h2>
              <p className="text-gray-soft-200 mb-2">
                Hora de entrada: {checkInTime?.toLocaleTimeString('es-ES')}
              </p>
              <p className="text-gray-soft-200 mb-8">
                Fecha: {checkInTime?.toLocaleDateString('es-ES')}
              </p>
              <Button
                variant="primary"
                size="lg"
                onClick={handleCheckOut}
              >
                Hacer Check-out
              </Button>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-6">📊</div>
              <h2 className="text-xl font-semibold text-primary-dark mb-6">
                Resumen del día
              </h2>

              <div className="bg-gray-soft-50 rounded-lg p-6 mb-6 max-w-md mx-auto">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-soft-200">Entrada:</span>
                    <span className="font-semibold text-primary-dark">
                      {checkInTime?.toLocaleTimeString('es-ES')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-soft-200">Salida:</span>
                    <span className="font-semibold text-primary-dark">
                      {checkOutTime?.toLocaleTimeString('es-ES')}
                    </span>
                  </div>
                  <div className="border-t border-gray-soft-200 pt-4">
                    <div className="flex justify-between">
                      <span className="text-gray-soft-200">Horas trabajadas:</span>
                      <span className="font-bold text-primary-cyan text-xl">
                        {calculateHours()} horas
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => navigate('/home')}
                >
                  Finalizar
                </Button>
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => {
                    setStep(1)
                    setCheckInTime(null)
                    setCheckOutTime(null)
                  }}
                >
                  Registrar otro día
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

export default Attendance
