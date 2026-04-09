import { createContext, useContext, useState, useEffect } from 'react'
import demoJobs from '../data/demoJobs.json'

const JobsContext = createContext()

export function useJobs() {
  const context = useContext(JobsContext)
  if (!context) {
    throw new Error('useJobs must be used within JobsProvider')
  }
  return context
}

export function JobsProvider({ children }) {
  const [jobs, setJobs] = useState([])
  const [applications, setApplications] = useState([])
  const [filteredJobs, setFilteredJobs] = useState([])

  useEffect(() => {
    // Load jobs from demo data
    setJobs(demoJobs)
    setFilteredJobs(demoJobs)
    
    // Load applications from localStorage
    const savedApplications = localStorage.getItem('mped_applications')
    if (savedApplications) {
      setApplications(JSON.parse(savedApplications))
    }
  }, [])

  const getJobById = (id) => {
    return jobs.find(job => job.id === parseInt(id))
  }

  const applyToJob = (jobId, userId) => {
    const application = {
      id: Date.now(),
      jobId: parseInt(jobId),
      userId,
      status: 'pending',
      appliedAt: new Date().toISOString()
    }
    
    const newApplications = [...applications, application]
    setApplications(newApplications)
    localStorage.setItem('mped_applications', JSON.stringify(newApplications))
    return application
  }

  const getApplicationsByJob = (jobId) => {
    return applications.filter(app => app.jobId === parseInt(jobId))
  }

  const getUserApplications = (userId) => {
    return applications.filter(app => app.userId === userId)
  }

  const updateApplicationStatus = (applicationId, status) => {
    const updatedApplications = applications.map(app =>
      app.id === applicationId ? { ...app, status } : app
    )
    setApplications(updatedApplications)
    localStorage.setItem('mped_applications', JSON.stringify(updatedApplications))
  }

  const createJob = (jobData) => {
    const newJob = {
      id: Date.now(),
      ...jobData,
      applicants: 0,
      status: 'active',
      isFeatured: false
    }
    
    const newJobs = [...jobs, newJob]
    setJobs(newJobs)
    setFilteredJobs(newJobs)
    return newJob
  }

  const filterJobs = (filters) => {
    let filtered = [...jobs]

    if (filters.category) {
      filtered = filtered.filter(job => job.category === filters.category)
    }

    if (filters.minPayment) {
      filtered = filtered.filter(job => job.payment >= filters.minPayment)
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchLower) ||
        job.company.toLowerCase().includes(searchLower) ||
        job.description.toLowerCase().includes(searchLower)
      )
    }

    setFilteredJobs(filtered)
  }

  const value = {
    jobs,
    filteredJobs,
    applications,
    getJobById,
    applyToJob,
    getApplicationsByJob,
    getUserApplications,
    updateApplicationStatus,
    createJob,
    filterJobs
  }

  return <JobsContext.Provider value={value}>{children}</JobsContext.Provider>
}
