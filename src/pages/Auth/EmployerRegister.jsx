import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'

const EmployerRegister = () => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    companyNIT: '',
    companyAddress: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { registerEmployer } = useAuth()
  const navigate = useNavigate()

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const handleStep1Submit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.email || !formData.password) {
      setError('Todos los campos son obligatorios')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setStep(2)
  }

  const handleStep2Submit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.companyName || !formData.companyNIT || !formData.companyAddress) {
      setError('Todos los campos son obligatorios')
      return
    }

    setStep(3)
    // Simulate verification
    setTimeout(() => {
      setStep(4)
    }, 2000)
  }

  const handleFinalSubmit = async () => {
    setLoading(true)
    try {
      await registerEmployer(formData.email, formData.password, {
        companyName: formData.companyName,
        companyNIT: formData.companyNIT,
        companyAddress: formData.companyAddress
      })
      navigate('/employer/dashboard')
    } catch (err) {
      setError('Error al crear la cuenta. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-soft-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
        <div className="mb-6">
          <Link to="/" className="text-sm text-primary-cyan hover:underline">
            ← Volver al inicio
          </Link>
        </div>
        {step === 1 && (
          <>
            <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
              <p className="font-semibold text-amber-900">Demo (UI funcional, sin backend)</p>
              <p className="mt-2 text-amber-950/90">
                <span className="font-medium">Correo:</span>{' '}
                <code className="rounded bg-amber-100/80 px-1">empresa@demo.local</code>
              </p>
              <p className="mt-1 text-amber-950/90">
                <span className="font-medium">Contraseña:</span>{' '}
                <code className="rounded bg-amber-100/80 px-1">demo123</code> (repite el mismo en confirmar)
              </p>
            </div>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-display font-bold text-primary-dark mb-2">
                Registro Empleador
              </h1>
              <p className="text-gray-soft-200">
                Crea tu cuenta para publicar ofertas
              </p>
            </div>

            <form onSubmit={handleStep1Submit} className="space-y-4">
              <Input
                label="Correo electrónico"
                type="email"
                placeholder="empresa@ejemplo.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />

              <Input
                label="Contraseña"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                required
              />

              <Input
                label="Confirmar contraseña"
                type="password"
                placeholder="Repite tu contraseña"
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                error={error}
                required
              />

              <Button
                type="submit"
                variant="primary"
                fullWidth
              >
                Siguiente
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

        {step === 2 && (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-display font-bold text-primary-dark mb-2">
                Datos de la empresa
              </h1>
              <p className="text-gray-soft-200">
                Completa la información de tu empresa
              </p>
            </div>

            <form onSubmit={handleStep2Submit} className="space-y-4">
              <Input
                label="Nombre de la empresa"
                type="text"
                placeholder="Mi Empresa S.A.S"
                value={formData.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
                error={error}
                required
              />

              <Input
                label="NIT"
                type="text"
                placeholder="900123456-1"
                value={formData.companyNIT}
                onChange={(e) => handleChange('companyNIT', e.target.value)}
                required
              />

              <Input
                label="Dirección"
                type="text"
                placeholder="Calle 123 #45-67, Ciudad"
                value={formData.companyAddress}
                onChange={(e) => handleChange('companyAddress', e.target.value)}
                required
              />

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  fullWidth
                  onClick={() => setStep(1)}
                >
                  Atrás
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                >
                  Continuar
                </Button>
              </div>
            </form>
          </>
        )}

        {step === 3 && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-cyan border-t-transparent mx-auto mb-6"></div>
            <h2 className="text-2xl font-display font-bold text-primary-dark mb-2">
              Verificando información
            </h2>
            <p className="text-gray-soft-200">
              Por favor espera...
            </p>
          </div>
        )}

        {step === 4 && (
          <div className="text-center">
            <div className="text-6xl mb-6">✅</div>
            <h1 className="text-3xl font-display font-bold text-primary-dark mb-4">
              ¡Registro exitoso!
            </h1>
            <p className="text-gray-soft-200 mb-8">
              Tu cuenta ha sido creada y verificada. Ya puedes comenzar a publicar ofertas.
            </p>
            <Button
              variant="primary"
              fullWidth
              onClick={handleFinalSubmit}
              loading={loading}
              disabled={loading}
            >
              Ir al panel
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default EmployerRegister
