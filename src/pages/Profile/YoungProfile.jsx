import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../contexts/UserContext'
import { useAuth } from '../../contexts/AuthContext'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import SkillChip from '../../components/common/SkillChip'
import Header from '../../components/layout/Header'
import Navigation from '../../components/layout/Navigation'
import demoSkills from '../../data/demoSkills.json'

const YoungProfile = () => {
  const { profile, updateProfile, completeProfile } = useUser()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  
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

  const categories = ['Ventas', 'Marketing', 'Reparto', 'Eventos', 'Fotografía', 'Educación', 'Atención al cliente', 'Tecnología']

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

  return (
    <div className="min-h-screen bg-gray-soft-50 pb-20 md:pb-0">
      <Header />
      <div className="container-custom py-8">
        <div className="max-w-3xl mx-auto">
          {/* Progress Bar */}
          {step < 5 && (
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-primary-dark">
                  Paso {step} de 4
                </span>
                <span className="text-sm text-gray-soft-200">
                  {Math.round((step / 4) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-soft-100 rounded-full h-2">
                <div
                  className="bg-primary-cyan h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(step / 4) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Step 1: Photo and Name */}
          {step === 1 && (
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-display font-bold text-primary-dark mb-6">
                Completa tu perfil
              </h2>
              <p className="text-gray-soft-200 mb-8">
                Cuéntanos sobre ti para encontrar las mejores oportunidades
              </p>

              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gray-soft-100 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
                    {formData.photo ? (
                      <img src={formData.photo} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-5xl">👤</span>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Simulate photo upload
                      setFormData(prev => ({ ...prev, photo: 'https://via.placeholder.com/150' }))
                    }}
                  >
                    Subir foto
                  </Button>
                </div>

                <Input
                  label="Nombre completo"
                  type="text"
                  placeholder="Tu nombre completo"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />

                <div className="flex gap-4">
                  <Button
                    variant="ghost"
                    fullWidth
                    onClick={() => navigate('/home')}
                  >
                    Omitir por ahora
                  </Button>
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={handleNext}
                    disabled={!formData.name}
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Skills */}
          {step === 2 && (
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-display font-bold text-primary-dark mb-2">
                Selecciona tus habilidades
              </h2>
              <p className="text-gray-soft-200 mb-6">
                Elige las habilidades que mejor te describen
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                {demoSkills.map(skill => (
                  <SkillChip
                    key={skill}
                    skill={skill}
                    selected={formData.skills.includes(skill)}
                    onClick={() => toggleSkill(skill)}
                  />
                ))}
              </div>

              <div className="flex gap-4">
                <Button variant="outline" fullWidth onClick={handleBack}>
                  Atrás
                </Button>
                <Button variant="primary" fullWidth onClick={handleNext}>
                  Siguiente
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Availability */}
          {step === 3 && (
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-display font-bold text-primary-dark mb-2">
                Tu disponibilidad
              </h2>
              <p className="text-gray-soft-200 mb-6">
                Indica cuándo estás disponible para trabajar
              </p>

              <div className="space-y-4 mb-8">
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => {
                  const dayNames = {
                    monday: 'Lunes',
                    tuesday: 'Martes',
                    wednesday: 'Miércoles',
                    thursday: 'Jueves',
                    friday: 'Viernes',
                    saturday: 'Sábado',
                    sunday: 'Domingo'
                  }

                  const dayData = formData.availability[day] || { available: false }
                  const isAvailable = dayData.available || false

                  return (
                    <div key={day} className="border border-gray-soft-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isAvailable}
                            onChange={() => toggleAvailability(day)}
                            className="w-5 h-5 text-primary-cyan rounded focus:ring-primary-cyan"
                          />
                          <span className="font-medium text-primary-dark">{dayNames[day]}</span>
                        </label>
                      </div>
                      {isAvailable && (
                        <div className="flex flex-col sm:flex-row gap-4 mt-3">
                          <div className="flex-1">
                            <label className="block text-sm text-gray-soft-200 mb-1">Desde</label>
                            <Input
                              type="time"
                              value={dayData.start || '09:00'}
                              onChange={(e) => setAvailabilityTime(day, 'start', e.target.value)}
                            />
                          </div>
                          <div className="flex-1">
                            <label className="block text-sm text-gray-soft-200 mb-1">Hasta</label>
                            <Input
                              type="time"
                              value={dayData.end || '17:00'}
                              onChange={(e) => setAvailabilityTime(day, 'end', e.target.value)}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              <div className="flex gap-4">
                <Button variant="outline" fullWidth onClick={handleBack}>
                  Atrás
                </Button>
                <Button variant="primary" fullWidth onClick={handleNext}>
                  Siguiente
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Interests */}
          {step === 4 && (
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-display font-bold text-primary-dark mb-2">
                Intereses laborales
              </h2>
              <p className="text-gray-soft-200 mb-6">
                Selecciona las categorías que más te interesan
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                {categories.map(category => (
                  <SkillChip
                    key={category}
                    skill={category}
                    selected={formData.interests.includes(category)}
                    onClick={() => toggleInterest(category)}
                  />
                ))}
              </div>

              <div className="flex gap-4">
                <Button variant="outline" fullWidth onClick={handleBack}>
                  Atrás
                </Button>
                <Button variant="primary" fullWidth onClick={handleNext}>
                  Ver perfil completo
                </Button>
              </div>
            </div>
          )}

          {/* Step 5: Final View */}
          {step === 5 && (
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-display font-bold text-primary-dark mb-6">
                Tu perfil está completo
              </h2>

              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gray-soft-100 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
                    {formData.photo ? (
                      <img src={formData.photo} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-5xl">👤</span>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-primary-dark">{formData.name || 'Usuario'}</h3>
                </div>

                <div>
                  <h4 className="font-semibold text-primary-dark mb-3">Habilidades</h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills && formData.skills.length > 0 ? (
                      formData.skills.map(skill => (
                        <SkillChip key={skill} skill={skill} variant="display" />
                      ))
                    ) : (
                      <p className="text-sm text-gray-soft-200 italic">No hay habilidades seleccionadas</p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-primary-dark mb-3">Intereses</h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.interests && formData.interests.length > 0 ? (
                      formData.interests.map(interest => (
                        <SkillChip key={interest} skill={interest} variant="display" />
                      ))
                    ) : (
                      <p className="text-sm text-gray-soft-200 italic">No hay intereses seleccionados</p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-primary-dark mb-3">Disponibilidad</h4>
                  <div className="space-y-2">
                    {Object.entries(formData.availability || {}).map(([day, data]) => {
                      const dayNames = {
                        monday: 'Lunes',
                        tuesday: 'Martes',
                        wednesday: 'Miércoles',
                        thursday: 'Jueves',
                        friday: 'Viernes',
                        saturday: 'Sábado',
                        sunday: 'Domingo'
                      }
                      if (data && data.available) {
                        return (
                          <p key={day} className="text-sm text-gray-soft-200">
                            {dayNames[day]}: {data.start || '09:00'} - {data.end || '17:00'}
                          </p>
                        )
                      }
                      return null
                    })}
                    {!Object.values(formData.availability || {}).some(d => d && d.available) && (
                      <p className="text-sm text-gray-soft-200 italic">No hay disponibilidad configurada</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" fullWidth onClick={() => setStep(1)}>
                    Editar perfil
                  </Button>
                  <Button variant="primary" fullWidth onClick={handleFinish}>
                    Comenzar a buscar trabajos
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Navigation />
    </div>
  )
}

export default YoungProfile
