import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'

import { profilesRouter } from './routes/profiles'
import { jobsRouter } from './routes/jobs'
import { applicationsRouter } from './routes/applications'
import { savedJobsRouter } from './routes/savedJobs'
import { coursesRouter } from './routes/courses'
import { enrollmentsRouter } from './routes/enrollments'
import { vocationalTestRouter } from './routes/vocationalTest'
import { credentialsRouter } from './routes/credentials'
import { notificationsRouter } from './routes/notifications'
import { ratingsRouter } from './routes/ratings'
import { employerRouter } from './routes/employer'
import { attendanceRouter } from './routes/attendance'

export const app = express()

const allowedOrigins = (process.env.CORS_ORIGIN ?? 'http://localhost:5180').split(',').map((o) => o.trim())
app.use(cors({ origin: allowedOrigins, credentials: true }))
app.use(express.json())

app.get('/health', (_req, res) => res.json({ ok: true }))

app.use('/api/profiles', profilesRouter)
app.use('/api/jobs', jobsRouter)
app.use('/api/applications', applicationsRouter)
app.use('/api/saved-jobs', savedJobsRouter)
app.use('/api/courses', coursesRouter)
app.use('/api/enrollments', enrollmentsRouter)
app.use('/api/vocational-test', vocationalTestRouter)
app.use('/api/credentials', credentialsRouter)
app.use('/api/notifications', notificationsRouter)
app.use('/api/ratings', ratingsRouter)
app.use('/api/employer', employerRouter)
app.use('/api/attendance', attendanceRouter)

app.use((req, res) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.path}` })
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err)
  res.status(500).json({ error: 'Error interno del servidor.' })
})
