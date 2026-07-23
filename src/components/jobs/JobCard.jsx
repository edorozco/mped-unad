import { Link } from "react-router-dom"
import Card from "../common/Card"
import SkillChip from "../common/SkillChip"

const JobCard = ({ job }) => {
  return (
    <Link to={`/offer/${job.id}`}>
      <Card
        hover
        className={`group relative overflow-hidden !border-[#333]/25 ${job.isFeatured ? "ring-2 ring-primary-cyan shadow-lg" : ""}`}
      >
        {job.isFeatured && (
          <div className="absolute top-4 right-4">
            <span className="bg-primary-cyan text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1">
              ⭐ Destacado
            </span>
          </div>
        )}

        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 bg-gray-soft-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden ring-2 ring-[#333]/25 group-hover:ring-primary-cyan transition-all">
            {job.companyLogo ? (
              <img src={job.companyLogo} alt={job.company} className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl">🏢</span>
            )}
          </div>
          <div className="flex-grow">
            <h3 className="text-lg font-semibold text-primary-dark mb-1 group-hover:text-primary-cyan transition-colors">
              {job.title}
            </h3>
            <p className="text-sm text-[#333]">{job.company}</p>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-[#333]">
            <span>📍</span>
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span>💰</span>
            <span className="font-semibold text-primary-cyan">
              ${job.payment.toLocaleString()} {job.paymentType}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#333]">
            <span>⏱️</span>
            <span>{job.duration}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {job.requirements.slice(0, 3).map((req, idx) => (
            <SkillChip key={idx} skill={req} variant="display" />
          ))}
          {job.requirements.length > 3 && (
            <span className="text-xs text-[#333] font-medium">+{job.requirements.length - 3} más</span>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[#333]/25">
          <span className="text-xs text-[#333]">{job.applicants} postulantes</span>
          <span className="text-sm font-semibold text-primary-cyan group-hover:translate-x-1 transition-transform">
            Ver detalles →
          </span>
        </div>
      </Card>
    </Link>
  )
}

export default JobCard
