import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { asyncHandler } from '../lib/asyncHandler'
import { requireAuth, AuthedRequest } from '../middleware/auth'
import { requireRole } from '../middleware/requireRole'
import { courseToApi } from '../lib/enumMaps'

export const enrollmentsRouter = Router()

enrollmentsRouter.get(
  '/me',
  requireAuth,
  requireRole('young'),
  asyncHandler(async (req: AuthedRequest, res) => {
    const enrollments = await prisma.enrollment.findMany({
      where: { youngId: req.user!.id },
      include: { course: true },
      orderBy: { enrolledAt: 'desc' },
    })
    res.json(enrollments.map((e) => ({ ...e, course: courseToApi(e.course) })))
  })
)
