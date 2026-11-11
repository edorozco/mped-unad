import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { asyncHandler } from '../lib/asyncHandler'
import { requireAuth, AuthedRequest } from '../middleware/auth'
import { requireRole } from '../middleware/requireRole'

export const ratingsRouter = Router()

/** El empleador califica a un joven tras un trabajo. */
ratingsRouter.post(
  '/',
  requireAuth,
  requireRole('employer'),
  asyncHandler(async (req: AuthedRequest, res) => {
    const { jobId, applicationId, rateeId, rating, comment } = req.body ?? {}
    if (!jobId || !rateeId || typeof rating !== 'number' || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Faltan jobId/rateeId o rating fuera de rango (1-5).' })
    }

    const job = await prisma.job.findUnique({ where: { id: jobId } })
    if (!job || job.employerId !== req.user!.id) {
      return res.status(403).json({ error: 'Este empleo no te pertenece.' })
    }

    const created = await prisma.rating.create({
      data: { jobId, applicationId: applicationId ?? null, raterId: req.user!.id, rateeId, rating, comment: comment ?? null },
    })
    res.status(201).json(created)
  })
)

/** Calificaciones recibidas (young) o dadas (employer) por el usuario logueado. */
ratingsRouter.get(
  '/me',
  requireAuth,
  asyncHandler(async (req: AuthedRequest, res) => {
    const ratings =
      req.user!.role === 'employer'
        ? await prisma.rating.findMany({ where: { raterId: req.user!.id }, include: { job: true, ratee: true }, orderBy: { createdAt: 'desc' } })
        : await prisma.rating.findMany({ where: { rateeId: req.user!.id }, include: { job: true, rater: true }, orderBy: { createdAt: 'desc' } })
    res.json(ratings)
  })
)
