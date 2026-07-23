import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import demoCourses from '../data/demoCourses.json'

const CoursesContext = createContext()

export function useCourses() {
  const context = useContext(CoursesContext)
  if (!context) {
    throw new Error('useCourses must be used within CoursesProvider')
  }
  return context
}

export function CoursesProvider({ children }) {
  const { user } = useAuth()
  const [enrollments, setEnrollments] = useState([])

  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`mped_enrollments_${user.id}`)
      setEnrollments(saved ? JSON.parse(saved) : [])
    } else {
      setEnrollments([])
    }
  }, [user])

  const getCourseById = (id) => demoCourses.find((c) => c.id === parseInt(id))

  const isEnrolled = (courseId) => enrollments.includes(parseInt(courseId))

  const enroll = (courseId) => {
    if (!user) return
    const id = parseInt(courseId)
    if (enrollments.includes(id)) return
    const updated = [...enrollments, id]
    setEnrollments(updated)
    localStorage.setItem(`mped_enrollments_${user.id}`, JSON.stringify(updated))
  }

  const value = {
    courses: demoCourses,
    enrollments,
    getCourseById,
    isEnrolled,
    enroll,
  }

  return <CoursesContext.Provider value={value}>{children}</CoursesContext.Provider>
}
