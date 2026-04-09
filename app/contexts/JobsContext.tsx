"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import demoJobs from "@/src/data/demoJobs.json"

interface Job {
  id: number
  title: string
  company: string
  category: string
  payment: number
  description: string
  [key: string]: any
}

interface Application {
  id: number
  jobId: number
  userId: number
  status: string
  appliedAt: string
}

interface JobsContextType {
  jobs: Job[]
  filteredJobs: Job[]
  applications: Application[]
  getJobById: (id: number | string) => Job | undefined
  applyToJob: (jobId: number | string, userId: number) => Application
  getApplicationsByJob: (jobId: number | string) => Application[]
  getUserApplications: (userId: number) => Application[]
  updateApplicationStatus: (applicationId: number, status: string) => void
  createJob: (jobData: Partial<Job>) => Job
  filterJobs: (filters: any) => void
}

const JobsContext = createContext<JobsContextType | undefined>(undefined)

export function useJobs() {
  const context = useContext(JobsContext)
  if (!context) {
    throw new Error("useJobs must be used within JobsProvider")
  }
  return context
}

export function JobsProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])

  useEffect(() => {
    setJobs(demoJobs)
    setFilteredJobs(demoJobs)

    const savedApplications = localStorage.getItem("mped_applications")
    if (savedApplications) {
      setApplications(JSON.parse(savedApplications))
    }
  }, [])

  const getJobById = (id: number | string) => {
    return jobs.find((job) => job.id === Number.parseInt(String(id)))
  }

  const applyToJob = (jobId: number | string, userId: number) => {
    const application: Application = {
      id: Date.now(),
      jobId: Number.parseInt(String(jobId)),
      userId,
      status: "pending",
      appliedAt: new Date().toISOString(),
    }

    const newApplications = [...applications, application]
    setApplications(newApplications)
    localStorage.setItem("mped_applications", JSON.stringify(newApplications))
    return application
  }

  const getApplicationsByJob = (jobId: number | string) => {
    return applications.filter((app) => app.jobId === Number.parseInt(String(jobId)))
  }

  const getUserApplications = (userId: number) => {
    return applications.filter((app) => app.userId === userId)
  }

  const updateApplicationStatus = (applicationId: number, status: string) => {
    const updatedApplications = applications.map((app) => (app.id === applicationId ? { ...app, status } : app))
    setApplications(updatedApplications)
    localStorage.setItem("mped_applications", JSON.stringify(updatedApplications))
  }

  const createJob = (jobData: Partial<Job>) => {
    const newJob: Job = {
      id: Date.now(),
      title: "",
      company: "",
      category: "",
      payment: 0,
      description: "",
      ...jobData,
      applicants: 0,
      status: "active",
      isFeatured: false,
    }

    const newJobs = [...jobs, newJob]
    setJobs(newJobs)
    setFilteredJobs(newJobs)
    return newJob
  }

  const filterJobs = (filters: any) => {
    let filtered = [...jobs]

    if (filters.category) {
      filtered = filtered.filter((job) => job.category === filters.category)
    }

    if (filters.minPayment) {
      filtered = filtered.filter((job) => job.payment >= filters.minPayment)
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchLower) ||
          job.company.toLowerCase().includes(searchLower) ||
          job.description.toLowerCase().includes(searchLower),
      )
    }

    setFilteredJobs(filtered)
  }

  const value: JobsContextType = {
    jobs,
    filteredJobs,
    applications,
    getJobById,
    applyToJob,
    getApplicationsByJob,
    getUserApplications,
    updateApplicationStatus,
    createJob,
    filterJobs,
  }

  return <JobsContext.Provider value={value}>{children}</JobsContext.Provider>
}
