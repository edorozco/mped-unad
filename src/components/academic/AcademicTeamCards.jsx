import {
  ACADEMIC_PARTICIPANTS,
  ACADEMIC_MEMBER_COMPANY,
  ACADEMIC_MEMBER_POSITION,
  getParticipantInitials,
} from "../../data/academicTeam"

function MemberCard({ name }) {
  return (
    <div className="h-full min-h-[260px] p-8 rounded-2xl bg-gradient-to-br from-gray-soft-50 to-white border border-gray-soft-200 shadow-md hover:shadow-lg transition-shadow text-center flex flex-col items-center">
      <div
        className="w-16 h-16 mx-auto mb-5 rounded-full bg-primary-cyan/15 border-2 border-primary-cyan/40 flex items-center justify-center text-primary-dark font-display font-bold text-lg"
        aria-hidden
      >
        {getParticipantInitials(name)}
      </div>
      <h3 className="font-display font-semibold text-primary-dark leading-snug text-lg">{name}</h3>
      <p className="text-sm text-gray-soft-300 mt-3 leading-snug">{ACADEMIC_MEMBER_POSITION}</p>
      <p className="text-sm font-medium text-primary-cyan mt-2">{ACADEMIC_MEMBER_COMPANY}</p>
    </div>
  )
}

export default function AcademicTeamCards() {
  const row1 = ACADEMIC_PARTICIPANTS.slice(0, 3)
  const row2 = ACADEMIC_PARTICIPANTS.slice(3, 5)

  return (
    <div className="max-w-5xl mx-auto px-2 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {row1.map((name) => (
          <MemberCard key={name} name={name} />
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-8">
        {row2.map((name) => (
          <div key={name} className="w-full max-w-[280px] sm:w-[260px] shrink-0">
            <MemberCard name={name} />
          </div>
        ))}
      </div>
    </div>
  )
}
