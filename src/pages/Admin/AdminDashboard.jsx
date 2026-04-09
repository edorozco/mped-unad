import { useState } from 'react'
import Header from '../../components/layout/Header'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import { useJobs } from '../../contexts/JobsContext'

const AdminDashboard = () => {
  const { jobs, applications } = useJobs()
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    userType: '',
    status: ''
  })
  const [showFilters, setShowFilters] = useState(false)

  // Mock admin data
  const totalUsers = 1250
  const totalJobs = jobs.length
  const totalCompleted = jobs.filter(j => j.status === 'completed').length
  const totalApplications = applications.length

  const handleExportCSV = () => {
    // Simulate CSV export
    const csvContent = `Usuario,Oferta,Estado,Fecha\nUsuario 1,Oferta 1,Completado,2024-02-10\nUsuario 2,Oferta 2,Activo,2024-02-11`
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'reporte-mped.csv'
    a.click()
    alert('Reporte exportado exitosamente')
  }

  const mockTableData = [
    { id: 1, user: 'María González', type: 'Joven', jobs: 5, status: 'Activo', joinDate: '2024-01-15' },
    { id: 2, user: 'Carlos Pérez', type: 'Joven', jobs: 3, status: 'Activo', joinDate: '2024-01-20' },
    { id: 3, user: 'Moda Express', type: 'Empleador', jobs: 12, status: 'Activo', joinDate: '2024-01-10' },
    { id: 4, user: 'Ana Martínez', type: 'Joven', jobs: 8, status: 'Activo', joinDate: '2024-01-05' },
    { id: 5, user: 'Delicias Express', type: 'Empleador', jobs: 6, status: 'Activo', joinDate: '2024-01-12' }
  ]

  return (
    <div className="min-h-screen bg-gray-soft-50">
      <Header />
      <div className="container-custom py-8">
        <h1 className="text-3xl font-display font-bold text-primary-dark mb-8">
          Panel Administrativo
        </h1>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-soft-200 mb-1">Total Usuarios</p>
                <p className="text-3xl font-bold text-primary-dark">{totalUsers}</p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-soft-200 mb-1">Total Ofertas</p>
                <p className="text-3xl font-bold text-primary-dark">{totalJobs}</p>
              </div>
              <div className="text-4xl">💼</div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-soft-200 mb-1">Completados</p>
                <p className="text-3xl font-bold text-primary-dark">{totalCompleted}</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-soft-200 mb-1">Postulaciones</p>
                <p className="text-3xl font-bold text-primary-dark">{totalApplications}</p>
              </div>
              <div className="text-4xl">📝</div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-bold text-primary-dark">
              Filtros
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? 'Ocultar' : 'Mostrar'} filtros
            </Button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                label="Fecha inicio"
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
              />
              <Input
                label="Fecha fin"
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
              />
              <div>
                <label className="block text-sm font-medium text-primary-dark mb-2">
                  Tipo de usuario
                </label>
                <select
                  value={filters.userType}
                  onChange={(e) => setFilters(prev => ({ ...prev, userType: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-soft-200 focus:outline-none focus:ring-2 focus:ring-primary-cyan focus:border-transparent"
                >
                  <option value="">Todos</option>
                  <option value="young">Jóvenes</option>
                  <option value="employer">Empleadores</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-primary-dark mb-2">
                  Estado
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-soft-200 focus:outline-none focus:ring-2 focus:ring-primary-cyan focus:border-transparent"
                >
                  <option value="">Todos</option>
                  <option value="active">Activo</option>
                  <option value="completed">Completado</option>
                  <option value="pending">Pendiente</option>
                </select>
              </div>
            </div>
          )}
        </Card>

        {/* Data Table */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-bold text-primary-dark">
              Reportes y Datos
            </h2>
            <Button
              variant="primary"
              onClick={handleExportCSV}
            >
              Exportar CSV
            </Button>
          </div>

          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-gray-soft-200">
                  <th className="text-left py-3 px-4 font-semibold text-primary-dark">Usuario</th>
                  <th className="text-left py-3 px-4 font-semibold text-primary-dark">Tipo</th>
                  <th className="text-left py-3 px-4 font-semibold text-primary-dark">Trabajos</th>
                  <th className="text-left py-3 px-4 font-semibold text-primary-dark">Estado</th>
                  <th className="text-left py-3 px-4 font-semibold text-primary-dark">Fecha registro</th>
                </tr>
              </thead>
              <tbody>
                {mockTableData.map(row => (
                  <tr key={row.id} className="border-b border-gray-soft-100 hover:bg-gray-soft-50">
                    <td className="py-3 px-4 text-primary-dark">{row.user}</td>
                    <td className="py-3 px-4 text-gray-soft-200">{row.type}</td>
                    <td className="py-3 px-4 text-gray-soft-200">{row.jobs}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full whitespace-nowrap">
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-soft-200 whitespace-nowrap">
                      {new Date(row.joinDate).toLocaleDateString('es-ES')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default AdminDashboard
