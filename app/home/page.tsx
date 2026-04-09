"use client"

import { useState, useEffect } from "react"
import { useJobs } from "@/app/contexts/JobsContext"
import Header from "@/src/components/layout/Header"
import Navigation from "@/src/components/layout/Navigation"
import JobCard from "@/src/components/jobs/JobCard"
import JobFilters from "@/src/components/jobs/JobFilters"
import Button from "@/src/components/common/Button"
import Input from "@/src/components/common/Input"

export default function HomePage() {
  const { filteredJobs, filterJobs } = useJobs()
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    category: "",
    minPayment: "",
    search: "",
  })

  useEffect(() => {
    filterJobs({ ...filters, search: searchQuery })
  }, [filters, searchQuery, filterJobs])

  const handleFilter = (newFilters: any) => {
    setFilters(newFilters)
  }

  return (
    <div className="min-h-screen bg-gray-soft-50 pb-20 md:pb-0">
      <Header />
      <div className="container-custom py-6">
        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Buscar trabajos, empresas, habilidades..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border-[#333]"
              />
            </div>
            <Button variant="outline" onClick={() => setShowFilters(true)} className="md:hidden">
              🔍 Filtros
            </Button>
          </div>

          {/* Desktop Filters */}
          <div className="hidden md:flex gap-4 items-center flex-wrap">
            <select
              value={filters.category}
              onChange={(e) => handleFilter({ ...filters, category: e.target.value })}
              className="px-4 py-2 rounded-lg border-2 border-[#333] focus:outline-none focus:border-primary-cyan min-w-[200px]"
            >
              <option value="">Todas las categorías</option>
              <option value="Ventas">Ventas</option>
              <option value="Marketing">Marketing</option>
              <option value="Reparto">Reparto</option>
              <option value="Eventos">Eventos</option>
              <option value="Fotografía">Fotografía</option>
              <option value="Educación">Educación</option>
            </select>
            <div className="w-40">
              <Input
                type="number"
                placeholder="Pago mínimo"
                value={filters.minPayment}
                onChange={(e) => handleFilter({ ...filters, minPayment: e.target.value })}
                className="border-[#333]"
              />
            </div>
            {(filters.category || filters.minPayment) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleFilter({ category: "", minPayment: "", search: "" })}
              >
                Limpiar filtros
              </Button>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-[#333]">
            {filteredJobs.length} {filteredJobs.length === 1 ? "oferta encontrada" : "ofertas encontradas"}
          </p>
        </div>

        {/* Jobs Grid */}
        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-primary-dark mb-2">No se encontraron ofertas</h3>
            <p className="text-[#333] mb-6">Intenta ajustar tus filtros de búsqueda</p>
            <Button
              variant="outline"
              onClick={() => {
                setFilters({ category: "", minPayment: "", search: "" })
                setSearchQuery("")
              }}
            >
              Limpiar búsqueda
            </Button>
          </div>
        )}
      </div>

      {/* Mobile Filters Modal */}
      <JobFilters isOpen={showFilters} onClose={() => setShowFilters(false)} onFilter={handleFilter} />

      <Navigation />
    </div>
  )
}
