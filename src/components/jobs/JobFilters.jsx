import { useState } from 'react'
import Card from '../common/Card'
import Button from '../common/Button'
import Input from '../common/Input'

const JobFilters = ({ onFilter, onClose, isOpen }) => {
  const [filters, setFilters] = useState({
    category: '',
    minPayment: '',
    search: ''
  })

  const categories = ['Ventas', 'Marketing', 'Reparto', 'Eventos', 'Fotografía', 'Educación', 'Atención al cliente', 'Tecnología']

  const handleChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }))
  }

  const handleApply = () => {
    onFilter(filters)
    if (onClose) onClose()
  }

  const handleReset = () => {
    const resetFilters = { category: '', minPayment: '', search: '' }
    setFilters(resetFilters)
    onFilter(resetFilters)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 md:hidden">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-bold text-primary-dark">Filtros</h2>
          <button
            onClick={onClose}
            className="text-[#333] hover:text-primary-dark"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-primary-dark mb-2">
              Categoría
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-[#333] focus:outline-none focus:border-primary-cyan"
            >
              <option value="">Todas las categorías</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-dark mb-2">
              Pago mínimo
            </label>
            <Input
              type="number"
              placeholder="Ej: 50000"
              value={filters.minPayment}
              onChange={(e) => handleChange('minPayment', e.target.value)}
              className="border-[#333]"
            />
          </div>

          <div className="flex gap-3">
            <Button variant="outline" fullWidth onClick={handleReset}>
              Limpiar
            </Button>
            <Button variant="primary" fullWidth onClick={handleApply}>
              Aplicar
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default JobFilters
