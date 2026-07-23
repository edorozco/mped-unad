import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useJobs } from '../../contexts/JobsContext'
import Header from '../../components/layout/Header'
import EmployerSidebar from '../../components/layout/EmployerSidebar'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Card from '../../components/common/Card'
import SkillChip from '../../components/common/SkillChip'
import Modal from '../../components/common/Modal'
import demoSkills from '../../data/demoSkills.json'

const CreateJob = () => {
  const navigate = useNavigate()
  const { createJob } = useJobs()
  const [showSuccess, setShowSuccess] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    address: '',
    category: '',
    requirements: [],
    payment: '',
    paymentType: 'por día',
    duration: '',
    schedule: '',
    startDate: ''
  })

  const categories = ['Ventas', 'Marketing', 'Reparto', 'Eventos', 'Fotografía', 'Educación', 'Atención al cliente', 'Tecnología']

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleRequirement = (skill) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.includes(skill)
        ? prev.requirements.filter(s => s !== skill)
        : [...prev.requirements, skill]
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newJob = createJob({
      ...formData,
      payment: parseInt(formData.payment),
      company: 'Mi Empresa',
      companyLogo: '',
      lat: 6.2476,
      lng: -75.5658
    })
    setShowSuccess(true)
  }

  return (
    <div className="min-h-screen bg-gray-soft-50">
      <Header />
      <EmployerSidebar />
      <div className="md:ml-64">
      <div className="container-custom py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/employer/dashboard')}
          className="mb-6"
        >
          ← Volver al panel
        </Button>

        <Card>
          <h1 className="text-3xl font-display font-bold text-primary-dark mb-8">
            Crear Microempleo
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Título del trabajo"
              type="text"
              placeholder="Ej: Asistente de ventas"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
              className="border-[#333]"
            />

            <div>
              <label className="block text-sm font-medium text-primary-dark mb-2">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Describe el trabajo, responsabilidades y requisitos..."
                rows={5}
                className="w-full px-4 py-3 rounded-lg border-2 border-[#333] focus:outline-none focus:ring-2 focus:ring-primary-cyan focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Ubicación"
                type="text"
                placeholder="Ej: El Poblado"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                required
                className="border-[#333]"
              />

              <Input
                label="Dirección completa"
                type="text"
                placeholder="Calle 123 #45-67"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                required
                className="border-[#333]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-dark mb-2">
                Categoría
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-[#333] focus:outline-none focus:ring-2 focus:ring-primary-cyan focus:border-transparent"
                required
              >
                <option value="">Selecciona una categoría</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-dark mb-2">
                Habilidades requeridas
              </label>
              <div className="flex flex-wrap gap-2">
                {demoSkills.map(skill => (
                  <SkillChip
                    key={skill}
                    skill={skill}
                    selected={formData.requirements.includes(skill)}
                    onClick={() => toggleRequirement(skill)}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Pago"
                type="number"
                placeholder="50000"
                value={formData.payment}
                onChange={(e) => handleChange('payment', e.target.value)}
                required
                className="border-[#333]"
              />

              <div>
                <label className="block text-sm font-medium text-primary-dark mb-2">
                  Tipo de pago
                </label>
                <select
                  value={formData.paymentType}
                  onChange={(e) => handleChange('paymentType', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-2 border-[#333] focus:outline-none focus:ring-2 focus:ring-primary-cyan focus:border-transparent"
                >
                  <option value="por día">Por día</option>
                  <option value="por hora">Por hora</option>
                  <option value="por evento">Por evento</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Duración"
                type="text"
                placeholder="Ej: 4 horas"
                value={formData.duration}
                onChange={(e) => handleChange('duration', e.target.value)}
                required
                className="border-[#333]"
              />

              <Input
                label="Horario"
                type="text"
                placeholder="Ej: Lunes a Viernes, 9:00 AM - 5:00 PM"
                value={formData.schedule}
                onChange={(e) => handleChange('schedule', e.target.value)}
                required
                className="border-[#333]"
              />
            </div>

            <Input
              label="Fecha de inicio"
              type="date"
              value={formData.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
              required
              className="border-[#333]"
            />

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                fullWidth
                onClick={() => navigate('/employer/dashboard')}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                fullWidth
              >
                Publicar Oferta
              </Button>
            </div>
          </form>
        </Card>
      </div>
      </div>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccess}
        onClose={() => {
          setShowSuccess(false)
          navigate('/employer/dashboard')
        }}
        title="Oferta publicada"
      >
        <div className="text-center py-6">
          <div className="text-6xl mb-6">✅</div>
          <p className="text-lg text-[#333] mb-6">
            Tu oferta ha sido publicada exitosamente. Los jóvenes podrán verla y postularse.
          </p>
          <Button
            variant="primary"
            fullWidth
            onClick={() => {
              setShowSuccess(false)
              navigate('/employer/dashboard')
            }}
          >
            Ver ofertas
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default CreateJob
