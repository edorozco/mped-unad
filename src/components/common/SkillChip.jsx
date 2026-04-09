const SkillChip = ({ 
  skill, 
  selected = false, 
  onClick,
  variant = 'selectable'
}) => {
  if (variant === 'display') {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-cyan bg-opacity-10 text-primary-cyan">
        {skill}
      </span>
    )
  }

  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center px-4 py-2 rounded-full text-sm font-medium
        transition-all duration-200
        ${selected
          ? 'bg-primary-cyan text-white shadow-md'
          : 'bg-gray-soft-100 text-primary-dark hover:bg-gray-soft-200'
        }
      `}
    >
      {skill}
    </button>
  )
}

export default SkillChip
