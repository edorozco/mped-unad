import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import OTPInput from '../../components/common/OTPInput'

const YoungRegister = () => {
  const [step, setStep] = useState(1)
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { registerYoung } = useAuth()
  const navigate = useNavigate()

  const handlePhoneSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!phone || phone.length < 10) {
      setError('Por favor ingresa un número de teléfono válido')
      return
    }

    setLoading(true)
    // Simulate OTP sending
    setTimeout(() => {
      setLoading(false)
      setStep(2)
    }, 1000)
  }

  const handleOTPComplete = async (otpValue) => {
    setOtp(otpValue)
    setError('')
    
    if (otpValue.length !== 6) {
      return
    }

    setLoading(true)
    try {
      await registerYoung(phone, otpValue)
      // Small delay to show loading state
      setTimeout(() => {
        setLoading(false)
        setStep(3)
      }, 500)
    } catch (err) {
      setError('Código inválido. Intenta nuevamente.')
      setLoading(false)
    }
  }

  const handleContinue = () => {
    navigate('/profile/young')
  }

  return (
    <div className="min-h-screen bg-gray-soft-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
        {step === 1 && (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-display font-bold text-primary-dark mb-2">
                Regístrate
              </h1>
              <p className="text-gray-soft-200">
                Ingresa tu número de teléfono para comenzar
              </p>
            </div>

            <form onSubmit={handlePhoneSubmit} className="space-y-6">
              <Input
                label="Número de teléfono"
                type="tel"
                placeholder="+57 300 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                error={error}
                required
              />

              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={loading}
              >
                {loading ? 'Enviando...' : 'Enviar código'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/login')}
                className="text-sm text-primary-cyan hover:underline"
              >
                Ya tengo cuenta
              </button>
            </div>
          </>
        )}

        {step === 2 && !loading && (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-display font-bold text-primary-dark mb-2">
                Verifica tu teléfono
              </h1>
              <p className="text-gray-soft-200">
                Ingresa el código de 6 dígitos enviado a<br />
                <span className="font-semibold text-primary-dark">{phone}</span>
              </p>
            </div>

            <div className="space-y-6">
              <OTPInput
                length={6}
                onComplete={handleOTPComplete}
                onChange={setOtp}
              />

              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}

              <div className="text-center">
                <button
                  onClick={() => {
                    setStep(1)
                    setOtp('')
                    setError('')
                  }}
                  className="text-sm text-primary-cyan hover:underline"
                >
                  Cambiar número
                </button>
              </div>
            </div>
          </>
        )}

        {loading && step === 2 && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-cyan border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-soft-200">Verificando código...</p>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-4">
            <div className="text-6xl mb-6">✅</div>
            <h1 className="text-3xl font-display font-bold text-primary-dark mb-4">
              ¡Registro exitoso!
            </h1>
            <p className="text-gray-soft-200 mb-8">
              Tu cuenta ha sido creada correctamente. Ahora completa tu perfil para comenzar.
            </p>
            <Button
              variant="primary"
              fullWidth
              onClick={handleContinue}
            >
              Completar perfil
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default YoungRegister
