"use client"

const Card = ({ children, className = "", hover = false, onClick }) => {
  const hoverStyles = hover ? "hover:shadow-xl hover:-translate-y-1 cursor-pointer transition-all duration-300" : ""

  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-2xl shadow-md p-6
        border border-gray-soft-200
        ${hoverStyles}
        ${className}
      `}
    >
      {children}
    </div>
  )
}

export default Card
