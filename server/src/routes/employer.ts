import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { asyncHandler } from '../lib/asyncHandler'
import { requireAuth, AuthedRequest } from '../middleware/auth'
import { requireRole } from '../middleware/requireRole'

export const employerRouter = Router()

employerRouter.get(
  '/dashboard-stats',
  requireAuth,
  requireRole('employer'),
  asyncHandler(async (req: AuthedRequest, res) => {
    const employerId = req.user!.id

    const [activeJobs, applications] = await Promise.all([
      prisma.job.count({ where: { employerId, status: 'active' } }),
      prisma.application.findMany({ where: { job: { employerId } }, select: { status: true } }),
    ])

    const pendingReview = applications.filter((a) => a.status === 'pending').length
    const finalized = applications.filter((a) => a.status !== 'pending').length

    const topJobs = await prisma.job.findMany({
      where: { employerId },
      include: { _count: { select: { applications: true } } },
      orderBy: { applications: { _count: 'desc' } },
      take: 3,
    })

    res.json({
      activeJobs,
      totalApplications: applications.length,
      pendingReview,
      finalized,
      topJobs: topJobs.map((j) => ({ id: j.id, title: j.title, applicants: j._count.applications })),
    })
  })
)

/** Postulantes recientes reales, a través de todos los empleos del empleador logueado. */
employerRouter.get(
  '/applicants/recent',
  requireAuth,
  requireRole('employer'),
  asyncHandler(async (req: AuthedRequest, res) => {
    const applications = await prisma.application.findMany({
      where: { job: { employerId: req.user!.id } },
      include: { young: true, job: { select: { id: true, title: true } } },
      orderBy: { appliedAt: 'desc' },
      take: 5,
    })
    res.json(applications)
  })
)
