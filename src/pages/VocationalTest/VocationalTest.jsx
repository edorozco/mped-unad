import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import Header from '../../components/layout/Header'
import Sidebar from '../../components/layout/Sidebar'
import Navigation from '../../components/layout/Navigation'
import Button from '../../components/common/Button'
import { QUESTIONS, ARCHETYPES } from '../../data/vocationalQuestions'

const VocationalTest = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState([])

  const total = QUESTIONS.length
  const question = QUESTIONS[currentIndex]
  const selectedArchetype = answers[currentIndex]
  const isLast = currentIndex === total - 1
  const progressPercent = Math.round(((currentIndex + 1) / total) * 100)

  const selectOption = (archetype) => {
    setAnswers((prev) => {
      const next = [...prev]
      next[currentIndex] = archetype
      return next
    })
  }

  const goPrevious = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1)
  }

  const finishTest = () => {
    const counts = Object.keys(ARCHETYPES).reduce((acc, key) => ({ ...acc, [key]: 0 }), {})
    answers.forEach((archetype) => {
      if (archetype) counts[archetype] += 1
    })

    const result = {
      completedAt: new Date().toISOString(),
      counts,
      totalQuestions: total,
    }

    if (user) {
      localStorage.setItem(`mped_vocational_${user.id}`, JSON.stringify(result))
    }

    navigate('/test-vocacional/resultado')
  }

  const goNext = () => {
    if (isLast) {
      finishTest()
    } else {
      setCurrentIndex((i) => i + 1)
    }
  }

  return (
    <div className="min-h-screen bg-gray-soft-50 pb-20 md:pb-0">
      <Header />
      <Sidebar />
      <div className="md:ml-64">
        <div className="container-custom py-8 max-w-3xl">
          {/* Progress header */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-primary-dark">
                Pregunta {currentIndex + 1} de {total}
              </span>
              <span className="text-sm text-gray-soft-300">{progressPercent}%</span>
            </div>
            <div className="w-full bg-gray-soft-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-primary-cyan h-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <h1 className="text-2xl md:text-3xl font-display font-bold text-primary-dark text-center mb-10 text-balance">
            {question.question}
          </h1>

          {/* Options bento grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {question.options.map((option) => {
              const isSelected = selectedArchetype === option.archetype
              return (
                <button
                  key={option.archetype}
                  type="button"
                  onClick={() => selectOption(option.archetype)}
                  className={`text-left p-6 rounded-xl border-2 transition-all bg-white ${
                    isSelected
                      ? 'border-primary-cyan ring-2 ring-primary-cyan/30 shadow-lg'
                      : 'border-gray-soft-200 hover:border-primary-cyan/50'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                      isSelected ? 'bg-primary-cyan text-white' : 'bg-gray-soft-100 text-primary-dark'
                    }`}
                  >
                    <span className="material-symbols-outlined text-2xl">
                      {ARCHETYPES[option.archetype].icon}
                    </span>
                  </div>
                  <h3 className="font-display font-semibold text-primary-dark mb-1">{option.title}</h3>
                  <p className="text-sm text-gray-soft-300">{option.description}</p>
                </button>
              )
            })}
          </div>

          {/* Sticky bottom nav */}
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={goPrevious} disabled={currentIndex === 0}>
              Anterior
            </Button>
            <p className="hidden sm:block text-sm text-gray-soft-300 italic">
              Elige la opción que más se parezca a ti
            </p>
            <Button variant="primary" onClick={goNext} disabled={!selectedArchetype}>
              {isLast ? 'Ver resultados' : 'Siguiente'}
            </Button>
          </div>
        </div>
      </div>
      <Navigation />
    </div>
  )
}

export default VocationalTest
