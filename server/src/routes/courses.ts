import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { asyncHandler } from '../lib/asyncHandler'
import { requireAuth, AuthedRequest } from '../middleware/auth'
import { requireRole } from '../middleware/requireRole'
import { courseToApi } from '../lib/enumMaps'

export const coursesRouter = Router()

coursesRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const { category } = req.query
    const courses = await prisma.course.findMany({
      where: category ? { category: String(category) } : undefined,
      orderBy: { createdAt: 'asc' },
    })
    res.json(courses.map(courseToApi))
  })
)

coursesRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const course = await prisma.course.findUnique({
      where: { id: req.params.id },
      include: { modules: { orderBy: { position: 'asc' }, include: { lessons: { orderBy: { position: 'asc' } } } } },
    })
    if (!course) return res.status(404).json({ error: 'Curso no encontrado.' })
    res.json(courseToApi(course))
  })
)

coursesRouter.post(
  '/:id/enroll',
  requireAuth,
  requireRole('young'),
  asyncHandler(async (req: AuthedRequest, res) => {
    const course = await prisma.course.findUnique({ where: { id: req.params.id } })
    if (!course) return res.status(404).json({ error: 'Curso no encontrado.' })

    const enrollment = await prisma.enrollment.upsert({
      where: { courseId_youngId: { courseId: req.params.id, youngId: req.user!.id } },
      create: { courseId: req.params.id, youngId: req.user!.id },
      update: {},
    })
    res.status(201).json(enrollment)
  })
)
