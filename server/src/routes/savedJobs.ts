import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { asyncHandler } from '../lib/asyncHandler'
import { requireAuth, AuthedRequest } from '../middleware/auth'
import { requireRole } from '../middleware/requireRole'
import { jobToApi } from '../lib/enumMaps'

export const savedJobsRouter = Router()

savedJobsRouter.get(
  '/me',
  requireAuth,
  requireRole('young'),
  asyncHandler(async (req: AuthedRequest, res) => {
    const saved = await prisma.savedJob.findMany({
      where: { youngId: req.user!.id },
      include: { job: true },
      orderBy: { createdAt: 'desc' },
    })
    res.json(saved.map((s) => ({ ...s, job: jobToApi(s.job) })))
  })
)
