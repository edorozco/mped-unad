import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'

const Login = () => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: ''
  })
  const [resetEmail, setResetEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const profile = await login(formData.emailOrPhone, formData.password)

      if (profile?.role === 'employer') {
        navigate('/employer/dashboard')
      } else if (profile?.role === 'young') {
        navigate(typeof from === 'string' && from.startsWith('/') ? from : '/home')
      } else {
        navigate('/')
      }
    } catch (err) {
      setError('Credenciales inválidas. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!resetEmail) {
      setError('Por favor ingresa tu correo electrónico')
      return
    }

    setLoading(true)
    // Simulate password reset
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
    }, 1000)
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
            <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-950">
              <p className="text-center font-semibold text-amber-900">Demo (cuentas reales)</p>

              <div className="mt-4 space-y-1 border-t border-amber-200/80 pt-4">
                <p className="font-semibold text-amber-900">Joven</p>
                <p className="text-amber-950/90">
                  <span className="text-amber-800/90">Correo:</span>{' '}
                  <code className="rounded bg-amber-100/90 px-1.5 py-0.5 text-amber-950">joven@demo.local</code>
                </p>
                <p className="text-amber-950/90">
                  <span className="text-amber-800/90">Contraseña:</span>{' '}
                  <code className="rounded bg-amber-100/90 px-1.5 py-0.5 text-amber-950">demo123</code>
                </p>
              </div>

              <div className="mt-4 space-y-1 border-t border-amber-200/80 pt-4">
                <p className="font-semibold text-amber-900">Empleador</p>
                <p className="text-amber-950/90">
                  <span className="text-amber-800/90">Correo:</span>{' '}
                  <code className="rounded bg-amber-100/90 px-1.5 py-0.5 text-amber-950">empleador@demo.local</code>
                </p>
                <p className="text-amber-950/90">
                  <span className="text-amber-800/90">Contraseña:</span>{' '}
                  <code className="rounded bg-amber-100/90 px-1.5 py-0.5 text-amber-950">demo123</code>
                </p>
              </div>
            </div>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-display font-bold text-primary-dark mb-2">
                Iniciar sesión
              </h1>
              <p className="text-gray-soft-200">
                Ingresa tus credenciales para continuar
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                label="Correo electrónico"
                type="email"
                placeholder="correo@ejemplo.com"
                value={formData.emailOrPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, emailOrPhone: e.target.value }))}
                error={error}
                required
              />

              <Input
                label="Contraseña"
                type="password"
                placeholder="Ingresa tu contraseña"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                required
              />

              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-sm text-primary-cyan hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              <Button type="submit" variant="primary" fullWidth disabled={loading}>
                {loading ? 'Ingresando…' : 'Iniciar sesión'}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-gray-soft-200">
                ¿No tienes cuenta?{' '}
                <Link to="/auth/young/register" className="text-primary-cyan hover:underline">
                  Regístrate como joven
                </Link>
              </p>
              <p className="text-sm text-gray-soft-200">
                o{' '}
                <Link to="/auth/employer/register" className="text-primary-cyan hover:underline">
                  Regístrate como empleador
                </Link>
              </p>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-display font-bold text-primary-dark mb-2">
                Recuperar contraseña
              </h1>
              <p className="text-gray-soft-200">
                Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña
              </p>
            </div>

            {!success ? (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <Input
                  label="Correo electrónico"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  error={error}
                  required
                />

                <Button type="submit" variant="primary" fullWidth disabled={loading}>
                  {loading ? 'Enviando…' : 'Enviar enlace'}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  fullWidth
                  onClick={() => setStep(1)}
                >
                  Volver a iniciar sesión
                </Button>
              </form>
            ) : (
              <div className="text-center">
                <div className="text-6xl mb-6">📧</div>
                <h2 className="text-2xl font-display font-bold text-primary-dark mb-4">
                  Enlace enviado
                </h2>
                <p className="text-gray-soft-200 mb-6">
                  Hemos enviado un enlace a <strong>{resetEmail}</strong> para restablecer tu contraseña.
                </p>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => {
                    setStep(1)
                    setSuccess(false)
                    setResetEmail('')
                  }}
                >
                  Volver a iniciar sesión
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Login
