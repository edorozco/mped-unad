"use client"
import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import Header from "../../components/layout/Header"
import Button from "../../components/common/Button"
import Input from "../../components/common/Input"

const ROLES = [
  {
    id: "young",
    icon: "school",
    iconColor: "text-primary-dark",
    title: "Joven",
    desc: "Quiero crear mi perfil, conocer mis habilidades y postularme a microempleos.",
  },
  {
    id: "employer",
    icon: "business",
    iconColor: "text-primary-cyan",
    title: "Empresa o MIPYME",
    desc: "Quiero publicar oportunidades y revisar candidatos.",
  },
]

const CITIES = [
  { value: "bogota", label: "Bogotá" },
  { value: "medellin", label: "Medellín" },
  { value: "cali", label: "Cali" },
  { value: "barranquilla", label: "Barranquilla" },
]

const ROLE_DESTINATIONS = {
  young: "/profile/young",
  employer: "/employer/dashboard",
}

const Register = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { register } = useAuth()

  const [role, setRole] = useState(location.pathname.includes("employer") ? "employer" : "young")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    city: "",
    businessName: "",
    nit: "",
  })
  const [consent, setConsent] = useState({ data: false, academic: false })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!formData.name || !formData.email || !formData.password || !formData.city) {
      setError("Todos los campos son obligatorios")
      return
    }

    if (role === "employer" && (!formData.businessName || !formData.nit)) {
      setError("Razón social y NIT son obligatorios para empresas")
      return
    }

    if (!consent.data || !consent.academic) {
      setError("Debes aceptar ambos consentimientos para continuar")
      return
    }

    setLoading(true)
    try {
      await register({ ...formData, role })
      navigate(ROLE_DESTINATIONS[role], { state: { justRegistered: true } })
    } catch (err) {
      setError("Error al crear la cuenta. Intenta nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-soft-50">
      <Header />
      <main className="flex-grow container-custom py-12 flex flex-col items-center">
        <div className="text-center mb-12 max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-display font-bold text-primary-dark mb-4 text-balance">
            Crea tu cuenta en MPED
          </h1>
          <p className="text-lg text-gray-soft-300">
            Únete a la plataforma que conecta el talento joven con el futuro digital.
          </p>
        </div>

        <div className="w-full max-w-5xl">
          {/* Role Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-3xl mx-auto">
            {ROLES.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className={`text-left bg-white border-2 p-6 rounded-xl transition-all duration-300 h-full flex flex-col ${
                  role === r.id
                    ? "border-primary-dark bg-primary-cyan/5 shadow-md"
                    : "border-gray-soft-200 hover:border-primary-cyan"
                }`}
              >
                <div className={`mb-4 ${r.iconColor}`}>
                  <span className="material-symbols-outlined text-4xl">{r.icon}</span>
                </div>
                <h3 className="text-xl font-display font-semibold text-primary-dark mb-2">{r.title}</h3>
                <p className="text-sm text-gray-soft-300">{r.desc}</p>
              </button>
            ))}
          </div>

          {/* Registration Form */}
          <div className="bg-white border border-gray-soft-200 rounded-xl p-8 shadow-sm max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Nombre completo"
                  placeholder="Ej. Juan Pérez"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                />
                <Input
                  label="Correo electrónico"
                  type="email"
                  placeholder="email@ejemplo.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                />
                <Input
                  label="Contraseña"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  required
                />
                <div className="w-full">
                  <label className="block text-sm font-medium text-primary-dark mb-2" htmlFor="city">
                    Ciudad
                  </label>
                  <select
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-soft-200 focus:outline-none focus:ring-2 focus:ring-primary-cyan focus:border-transparent transition-all duration-200"
                  >
                    <option value="" disabled>
                      Selecciona tu ciudad
                    </option>
                    {CITIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {role === "employer" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-soft-200">
                  <Input
                    label="Razón social"
                    placeholder="Mi Empresa S.A.S"
                    value={formData.businessName}
                    onChange={(e) => handleChange("businessName", e.target.value)}
                    required
                  />
                  <Input
                    label="NIT"
                    placeholder="900123456-1"
                    value={formData.nit}
                    onChange={(e) => handleChange("nit", e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="space-y-4 pt-2">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={consent.data}
                    onChange={(e) => setConsent((prev) => ({ ...prev, data: e.target.checked }))}
                    className="mt-1 w-5 h-5 rounded border-gray-soft-200 text-primary-cyan focus:ring-primary-cyan"
                  />
                  <span className="text-sm text-gray-soft-300 leading-snug">
                    Acepto el tratamiento de mis datos personales según la Política de Privacidad.
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={consent.academic}
                    onChange={(e) => setConsent((prev) => ({ ...prev, academic: e.target.checked }))}
                    className="mt-1 w-5 h-5 rounded border-gray-soft-200 text-primary-cyan focus:ring-primary-cyan"
                  />
                  <span className="text-sm text-gray-soft-300 leading-snug">
                    Doy mi consentimiento informado para la validación académica de mis logros y credenciales.
                  </span>
                </label>
              </div>

              <div className="bg-gray-soft-50 border border-gray-soft-200 p-4 rounded-lg flex items-center gap-3">
                <span className="material-symbols-outlined text-primary-dark">info</span>
                <p className="text-sm text-gray-soft-300">
                  Tus datos serán usados únicamente con fines académicos.
                </p>
              </div>

              {error && <p className="text-sm text-red-500 text-center">{error}</p>}

              <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading}>
                {loading ? "Creando cuenta..." : "Comenzar mi futuro"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-sm text-primary-cyan hover:underline"
              >
                Ya tengo cuenta, iniciar sesión
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Register
