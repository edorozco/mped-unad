import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { asyncHandler } from '../lib/asyncHandler'
import { requireAuth, AuthedRequest } from '../middleware/auth'
import { requireRole } from '../middleware/requireRole'
import { jobToApi } from '../lib/enumMaps'

export const applicationsRouter = Router()

applicationsRouter.get(
  '/me',
  requireAuth,
  requireRole('young'),
  asyncHandler(async (req: AuthedRequest, res) => {
    const applications = await prisma.application.findMany({
      where: { youngId: req.user!.id },
      include: { job: true },
      orderBy: { appliedAt: 'desc' },
    })
    res.json(applications.map((a) => ({ ...a, job: jobToApi(a.job) })))
  })
)

/** Confirmar/rechazar un postulante (employer, dueño del empleo asociado). */
applicationsRouter.patch(
  '/:id',
  requireAuth,
  requireRole('employer'),
  asyncHandler(async (req: AuthedRequest, res) => {
    const { status } = req.body ?? {}
    if (!['pending', 'confirmed', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Estado inválido.' })
    }

    const application = await prisma.application.findUnique({ where: { id: req.params.id }, include: { job: true } })
    if (!application) return res.status(404).json({ error: 'Postulación no encontrada.' })
    if (application.job.employerId !== req.user!.id) {
      return res.status(403).json({ error: 'Esta postulación no pertenece a un empleo tuyo.' })
    }

    const updated = await prisma.application.update({ where: { id: req.params.id }, data: { status } })
    res.json(updated)
  })
)
