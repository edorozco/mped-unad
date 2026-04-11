/** Integrantes del proyecto académico (Landing + Contacto) */
export const ACADEMIC_PARTICIPANTS = [
  "Camilo Orozco",
  "Jonathan Rivera",
  "Daniel Mejia",
  "Angela Villa",
  "Felipe Llamosa",
]

/** Mismo perfil para todo el equipo en esta demo */
export const ACADEMIC_MEMBER_POSITION = "Est. Ingeniería en Sistemas"
export const ACADEMIC_MEMBER_COMPANY = "UNAD"

export function getParticipantInitials(fullName) {
  const parts = fullName.trim().split(/\s+/)
  if (parts.length === 0) return "?"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[Math.min(2, parts.length - 1)][0]).toUpperCase()
}
