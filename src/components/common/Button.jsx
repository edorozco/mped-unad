"use client"

const Button = ({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  onClick,
  type = "button",
  className = "",
}) => {
  const baseStyles =
    "font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"

  const variants = {
    primary:
      "bg-primary-cyan text-white hover:brightness-95 hover:shadow-lg hover:scale-[1.02] focus:ring-primary-cyan active:scale-[0.98]",
    secondary: "bg-primary-dark text-white hover:shadow-lg hover:bg-primary-dark/90 focus:ring-primary-dark",
    outline:
      "border-2 border-primary-cyan text-primary-cyan bg-transparent hover:bg-primary-cyan hover:text-white focus:ring-primary-cyan transition-colors",
    /** For dark backgrounds (e.g. hero): white border + white label */
    outlineLight:
      "border-2 border-white text-white bg-transparent hover:bg-white/10 focus:ring-white focus:ring-offset-0 focus:ring-offset-transparent",
    ghost: "text-primary-cyan hover:bg-gray-soft-50 focus:ring-primary-cyan",
  }

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  }

  const widthClass = fullWidth ? "w-full" : ""

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
    >
      {children}
    </button>
  )
}

export default Button
