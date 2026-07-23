import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useUser } from '../../contexts/UserContext'
import { useAuth } from '../../contexts/AuthContext'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import SkillChip from '../../components/common/SkillChip'
import Header from '../../components/layout/Header'
import Sidebar from '../../components/layout/Sidebar'
import Navigation from '../../components/layout/Navigation'
import demoSkills from '../../data/demoSkills.json'

const STEPS = [
  { num: 1, label: 'Básico' },
  { num: 2, label: 'Habilidades' },
  { num: 3, label: 'Disponibilidad' },
  { num: 4, label: 'Intereses' },
  { num: 5, label: 'Vista previa' },
]

const DAYS = [
  { key: 'monday', short: 'Lun', label: 'Lunes' },
  { key: 'tuesday', short: 'Mar', label: 'Martes' },
  { key: 'wednesday', short: 'Mié', label: 'Miércoles' },
  { key: 'thursday', short: 'Jue', label: 'Jueves' },
  { key: 'friday', short: 'Vie', label: 'Viernes' },
  { key: 'saturday', short: 'Sáb', label: 'Sábado' },
  { key: 'sunday', short: 'Dom', label: 'Domingo' },
]

const INTEREST_CATEGORIES = [
  { name: 'Ventas', icon: 'sell' },
  { name: 'Marketing', icon: 'campaign' },
  { name: 'Reparto', icon: 'two_wheeler' },
  { name: 'Eventos', icon: 'event' },
  { name: 'Fotografía', icon: 'photo_camera' },
  { name: 'Educación', icon: 'school' },
  { name: 'Atención al cliente', icon: 'support_agent' },
  { name: 'Tecnología', icon: 'computer' },
]

const CITY_LABELS = {
  bogota: 'Bogotá',
  medellin: 'Medellín',
  cali: 'Cali',
  barranquilla: 'Barranquilla',
}

function Stepper({ currentStep }) {
  return (
    <div className="w-full max-w-2xl mx-auto mb-12">
      <div className="relative flex justify-between items-center">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-soft-200 -translate-y-1/2 z-0" />
        <div
          className="absolute top-1/2 left-0 h-0.5 bg-primary-cyan -translate-y-1/2 z-0 transition-all duration-500"
          style={{ width: `${(Math.min(currentStep - 1, STEPS.length - 1) / (STEPS.length - 1)) * 100}%` }}
        />
        {STEPS.map((s) => (
          <div key={s.num} className="relative z-10 flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ring-4 ring-gray-soft-50 ${
                s.num < currentStep
                  ? 'bg-primary-cyan text-white'
                  : s.num === currentStep
                  ? 'bg-primary-dark text-white'
                  : 'bg-gray-soft-200 text-gray-soft-300'
              }`}
            >
              {s.num < currentStep ? (
                <span className="material-symbols-outlined text-lg">check</span>
              ) : (
                s.num
              )}
            </div>
            <span
              className={`absolute top-11 text-xs font-medium whitespace-nowrap hidden sm:block ${
                s.num === currentStep ? 'text-primary-dark font-bold' : 'text-gray-soft-300'
              }`}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function StepNav({ onBack, onNext, nextLabel = 'Siguiente Paso', backLabel = 'Atrás', showBack = true }) {
  return (
    <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-soft-200">
      {showBack ? (
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium text-primary-dark hover:bg-gray-soft-100 px-4 py-2 rounded-lg transition-colors"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          {backLabel}
        </button>
      ) : (
        <span />
      )}
      <button
        type="button"
        onClick={onNext}
        className="flex items-center gap-2 bg-primary-dark text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 active:scale-95 transition-all shadow-md"
      >
        {nextLabel}
        <span className="material-symbols-outlined text-lg">arrow_forward</span>
      </button>
    </div>
  )
}

const YoungProfile = () => {
  const { profile, updateProfile, completeProfile } = useUser()
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const cameFromRegistration = location.state?.justRegistered === true
  const [step, setStep] = useState(1)
  const [skillSearch, setSkillSearch] = useState('')

  const defaultAvailability = {
    monday: { available: false },
    tuesday: { available: false },
    wednesday: { available: false },
    thursday: { available: false },
    friday: { available: false },
    saturday: { available: false },
    sunday: { available: false }
  }

  const [formData, setFormData] = useState({
    name: '',
    photo: '',
    skills: [],
    availability: defaultAvailability,
    interests: []
  })

  // Initialize formData when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        photo: profile.photo || '',
        skills: profile.skills || [],
        availability: profile.availability || defaultAvailability,
        interests: profile.interests || []
      })

      if (profile.profileComplete) {
        setStep(5) // Go directly to final view if profile is complete
      }
    }
  }, [profile])

  const handleNext = () => {
    if (step < 5) {
      updateProfile(formData)
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleFinish = () => {
    updateProfile(formData)
    completeProfile()
    navigate('/home')
  }

  const toggleSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }))
  }

  const toggleAvailability = (day) => {
    setFormData(prev => {
      const currentDay = prev.availability[day] || { available: false }
      return {
        ...prev,
        availability: {
          ...prev.availability,
          [day]: {
            ...currentDay,
            available: !currentDay.available
          }
        }
      }
    })
  }

  const setAvailabilityTime = (day, field, value) => {
    setFormData(prev => {
      const currentDay = prev.availability[day] || { available: false }
      return {
        ...prev,
        availability: {
          ...prev.availability,
          [day]: {
            ...currentDay,
            [field]: value
          }
        }
      }
    })
  }

  const toggleInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  const filteredSkills = demoSkills.filter((skill) =>
    skill.toLowerCase().includes(skillSearch.trim().toLowerCase())
  )

  const availableDays = DAYS.filter((d) => formData.availability[d.key]?.available)
  const showSidebar = !cameFromRegistration

  return (
    <div className="min-h-screen bg-gray-soft-50 pb-20 md:pb-0">
      <Header />
      {showSidebar && <Sidebar />}
      <div className={showSidebar ? 'md:ml-64' : ''}>
      <div className="container-custom py-10">
        <div className="max-w-3xl mx-auto">
          <Stepper currentStep={step} />

          {/* Step 1: Photo and Name */}
          {step === 1 && (
            <div className="bg-white rounded-xl border border-gray-soft-200 shadow-sm p-8 md:p-12">
              <h1 className="text-2xl md:text-3xl font-display font-bold text-primary-dark mb-2">
                Empecemos con lo básico
              </h1>
              <p className="text-gray-soft-300 mb-8">
                Una buena presentación te ayuda a destacar frente a los empleadores.
              </p>

              <div className="flex flex-col items-center gap-8">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full border-2 border-dashed border-gray-soft-200 flex flex-col items-center justify-center bg-gray-soft-50 hover:bg-gray-soft-100 cursor-pointer transition-colors overflow-hidden"
                    onClick={() => setFormData(prev => ({ ...prev, photo: '/placeholder-user.jpg' }))}
                  >
                    {formData.photo ? (
                      <img src={formData.photo} alt="Perfil" className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-3xl text-gray-soft-300 mb-1">add_a_photo</span>
                        <span className="text-xs text-gray-soft-300">Subir foto</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="w-full space-y-2">
                  <label className="block text-sm font-medium text-primary-dark">Nombre completo</label>
                  <Input
                    type="text"
                    placeholder="Ingresa tu nombre completo"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-soft-200">
                <button
                  type="button"
                  onClick={() => navigate('/home')}
                  className="text-sm text-gray-soft-300 hover:text-primary-cyan hover:underline transition-colors"
                >
                  Omitir por ahora
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!formData.name}
                  className="flex items-center gap-2 bg-primary-dark text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
                >
                  Siguiente Paso
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Skills */}
          {step === 2 && (
            <div className="bg-white rounded-xl border border-gray-soft-200 shadow-sm p-8 md:p-12">
              <h1 className="text-2xl md:text-3xl font-display font-bold text-primary-dark mb-2">
                Tus habilidades digitales
              </h1>
              <p className="text-gray-soft-300 mb-8">
                Selecciona las áreas en las que tienes conocimiento o experiencia. Esto nos ayuda a encontrarte las mejores microtareas.
              </p>

              <div className="space-y-8">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-soft-300">
                    search
                  </span>
                  <input
                    type="text"
                    placeholder="Busca una habilidad (ej. Ventas, Diseño)"
                    value={skillSearch}
                    onChange={(e) => setSkillSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-soft-200 focus:outline-none focus:ring-2 focus:ring-primary-cyan focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-primary-dark flex items-center gap-2 mb-3">
                    <span className="material-symbols-outlined text-lg">task_alt</span>
                    Habilidades seleccionadas
                  </h3>
                  <div className="flex flex-wrap gap-2 min-h-[56px] p-4 bg-gray-soft-50 border border-dashed border-gray-soft-200 rounded-lg">
                    {formData.skills.length > 0 ? (
                      formData.skills.map((skill) => (
                        <span
                          key={skill}
                          className="flex items-center gap-2 bg-primary-cyan/15 text-primary-dark px-3 py-1.5 rounded-full text-sm font-medium"
                        >
                          {skill}
                          <button type="button" onClick={() => toggleSkill(skill)} aria-label={`Quitar ${skill}`}>
                            <span className="material-symbols-outlined text-sm">close</span>
                          </button>
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-gray-soft-300 italic">Aún no has seleccionado habilidades</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-gray-soft-300 uppercase tracking-wider mb-3">
                    Habilidades sugeridas
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {filteredSkills.map((skill) => (
                      <SkillChip
                        key={skill}
                        skill={skill}
                        selected={formData.skills.includes(skill)}
                        onClick={() => toggleSkill(skill)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <StepNav onBack={handleBack} onNext={handleNext} />
            </div>
          )}

          {/* Step 3: Availability */}
          {step === 3 && (
            <div className="bg-white rounded-xl border border-gray-soft-200 shadow-sm p-8 md:p-12">
              <h1 className="text-2xl md:text-3xl font-display font-bold text-primary-dark mb-2">
                Tu disponibilidad
              </h1>
              <p className="text-gray-soft-300 mb-8">
                Cuéntanos cuándo puedes trabajar para encontrarte las mejores ofertas.
              </p>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xs font-semibold text-primary-dark uppercase tracking-wider mb-4">
                    Días de la semana
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {DAYS.map((day) => {
                      const isAvailable = formData.availability[day.key]?.available || false
                      return (
                        <button
                          key={day.key}
                          type="button"
                          onClick={() => toggleAvailability(day.key)}
                          className={`px-5 py-3 rounded-lg text-sm font-medium border-2 transition-all ${
                            isAvailable
                              ? 'bg-primary-cyan text-white border-primary-cyan'
                              : 'border-gray-soft-200 text-primary-dark hover:border-primary-cyan'
                          }`}
                        >
                          {day.short}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {availableDays.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold text-primary-dark uppercase tracking-wider mb-4">
                      Horario por día
                    </h3>
                    <div className="space-y-3">
                      {availableDays.map((day) => {
                        const dayData = formData.availability[day.key] || {}
                        return (
                          <div
                            key={day.key}
                            className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-lg bg-gray-soft-50 border border-gray-soft-200"
                          >
                            <span className="font-medium text-primary-dark w-24 flex-shrink-0">{day.label}</span>
                            <div className="flex items-center gap-3 flex-1">
                              <Input
                                type="time"
                                value={dayData.start || '09:00'}
                                onChange={(e) => setAvailabilityTime(day.key, 'start', e.target.value)}
                              />
                              <span className="text-gray-soft-300">a</span>
                              <Input
                                type="time"
                                value={dayData.end || '17:00'}
                                onChange={(e) => setAvailabilityTime(day.key, 'end', e.target.value)}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                <div className="bg-primary-dark rounded-xl p-6 flex items-start gap-4 text-white">
                  <span className="material-symbols-outlined text-primary-cyan">info</span>
                  <div>
                    <p className="font-semibold mb-1">Dato útil</p>
                    <p className="text-sm opacity-90">
                      Los usuarios con disponibilidad flexible suelen recibir más propuestas de microempleos.
                    </p>
                  </div>
                </div>
              </div>

              <StepNav onBack={handleBack} onNext={handleNext} />
            </div>
          )}

          {/* Step 4: Interests */}
          {step === 4 && (
            <div className="bg-white rounded-xl border border-gray-soft-200 shadow-sm p-8 md:p-12">
              <h1 className="text-2xl md:text-3xl font-display font-bold text-primary-dark mb-2">
                Tus intereses laborales
              </h1>
              <p className="text-gray-soft-300 mb-8">
                Elige las categorías donde te gustaría trabajar y aprender.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-2">
                {INTEREST_CATEGORIES.map((category) => {
                  const isSelected = formData.interests.includes(category.name)
                  return (
                    <button
                      key={category.name}
                      type="button"
                      onClick={() => toggleInterest(category.name)}
                      className={`relative flex flex-col items-start p-5 rounded-xl border-2 text-left transition-all ${
                        isSelected
                          ? 'border-primary-cyan bg-primary-cyan/5 shadow-md'
                          : 'border-gray-soft-200 hover:border-primary-cyan'
                      }`}
                    >
                      <div className="w-11 h-11 rounded-lg bg-gray-soft-100 flex items-center justify-center text-primary-dark mb-3">
                        <span className="material-symbols-outlined text-2xl">{category.icon}</span>
                      </div>
                      <h3 className="text-sm font-semibold text-primary-dark">{category.name}</h3>
                      {isSelected && (
                        <span className="material-symbols-outlined absolute top-3 right-3 text-primary-cyan text-xl">
                          check_circle
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>

              <StepNav onBack={handleBack} onNext={handleNext} nextLabel="Ver perfil completo" />
            </div>
          )}

          {/* Step 5: Final Preview */}
          {step === 5 && (
            <div className="bg-white rounded-xl border border-gray-soft-200 shadow-sm p-8 md:p-12">
              <div className="text-center mb-10">
                <h1 className="text-2xl md:text-3xl font-display font-bold text-primary-dark mb-2">
                  ¡Todo listo para brillar!
                </h1>
                <p className="text-gray-soft-300">Revisa tu perfil antes de comenzar a buscar microempleos.</p>
              </div>

              <div className="flex flex-col md:flex-row gap-10">
                {/* Identity column */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left w-full md:w-1/3">
                  <div className="relative mb-4">
                    <div className="w-32 h-32 rounded-full border-4 border-gray-soft-100 bg-gray-soft-50 flex items-center justify-center overflow-hidden">
                      {formData.photo ? (
                        <img src={formData.photo} alt="Perfil" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-5xl">👤</span>
                      )}
                    </div>
                    <div className="absolute bottom-1 right-1 w-9 h-9 bg-primary-cyan rounded-full flex items-center justify-center shadow-md border-2 border-white">
                      <span className="material-symbols-outlined text-white text-lg">verified</span>
                    </div>
                  </div>
                  <h2 className="text-xl font-display font-bold text-primary-dark">{formData.name || 'Usuario'}</h2>

                  <div className="flex flex-col gap-2 w-full mt-4 pt-4 border-t border-gray-soft-200">
                    {user?.city && (
                      <div className="flex items-center gap-2 text-gray-soft-300 justify-center md:justify-start">
                        <span className="material-symbols-outlined text-sm">location_on</span>
                        <span className="text-sm">{CITY_LABELS[user.city] || user.city}</span>
                      </div>
                    )}
                    {user?.email && (
                      <div className="flex items-center gap-2 text-gray-soft-300 justify-center md:justify-start">
                        <span className="material-symbols-outlined text-sm">mail</span>
                        <span className="text-sm">{user.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Details column */}
                <div className="flex-grow w-full space-y-8">
                  <section>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-semibold text-primary-dark uppercase tracking-wider">Habilidades</h3>
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="flex items-center gap-1 text-xs text-primary-cyan hover:underline"
                      >
                        <span className="material-symbols-outlined text-xs">edit</span> Editar
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.length > 0 ? (
                        formData.skills.map((skill) => <SkillChip key={skill} skill={skill} variant="display" />)
                      ) : (
                        <p className="text-sm text-gray-soft-300 italic">No hay habilidades seleccionadas</p>
                      )}
                    </div>
                  </section>

                  <section>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-semibold text-primary-dark uppercase tracking-wider">Disponibilidad</h3>
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="flex items-center gap-1 text-xs text-primary-cyan hover:underline"
                      >
                        <span className="material-symbols-outlined text-xs">edit</span> Editar
                      </button>
                    </div>
                    {availableDays.length > 0 ? (
                      <div className="space-y-2">
                        {availableDays.map((day) => {
                          const d = formData.availability[day.key]
                          return (
                            <p key={day.key} className="text-sm text-gray-soft-300">
                              <span className="font-medium text-primary-dark">{day.label}:</span>{' '}
                              {d.start || '09:00'} - {d.end || '17:00'}
                            </p>
                          )
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-soft-300 italic">No hay disponibilidad configurada</p>
                    )}
                  </section>

                  <section>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-semibold text-primary-dark uppercase tracking-wider">Áreas de interés</h3>
                      <button
                        type="button"
                        onClick={() => setStep(4)}
                        className="flex items-center gap-1 text-xs text-primary-cyan hover:underline"
                      >
                        <span className="material-symbols-outlined text-xs">edit</span> Editar
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.interests.length > 0 ? (
                        formData.interests.map((interest) => (
                          <SkillChip key={interest} skill={interest} variant="display" />
                        ))
                      ) : (
                        <p className="text-sm text-gray-soft-300 italic">No hay intereses seleccionados</p>
                      )}
                    </div>
                  </section>

                  <div className="bg-accent-gold/10 border border-accent-gold/25 p-5 rounded-xl flex items-center gap-4">
                    <div className="hidden sm:flex shrink-0 w-12 h-12 rounded-full bg-accent-gold items-center justify-center">
                      <span className="material-symbols-outlined text-white text-2xl">workspace_premium</span>
                    </div>
                    <div>
                      <p className="font-display font-semibold text-primary-dark leading-tight">
                        Credencial "Listo para Empezar"
                      </p>
                      <p className="text-sm text-gray-soft-300">
                        Al finalizar obtendrás tu primer sello de validación MPED para tu perfil público.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 pt-6 border-t border-gray-soft-200">
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-semibold text-primary-dark border-2 border-primary-dark hover:bg-gray-soft-50 transition-all"
                >
                  <span className="material-symbols-outlined text-lg">arrow_back</span>
                  Atrás
                </button>
                <button
                  type="button"
                  onClick={handleFinish}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-3 rounded-lg font-semibold bg-primary-dark text-white hover:opacity-90 active:scale-95 transition-all shadow-md"
                >
                  Finalizar Perfil
                  <span className="material-symbols-outlined text-lg">rocket_launch</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
      <Navigation />
    </div>
  )
}

export default YoungProfile
