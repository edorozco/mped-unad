import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { asyncHandler } from '../lib/asyncHandler'
import { requireAuth, AuthedRequest } from '../middleware/auth'
import { requireRole } from '../middleware/requireRole'
import { PAYMENT_TYPE_TO_DB, MODALITY_TO_DB, SCHEDULE_TYPE_TO_DB, jobToApi } from '../lib/enumMaps'

export const jobsRouter = Router()

function withApplicantsCount<T extends { _count: { applications: number } }>(job: T) {
  const { _count, ...rest } = job
  return jobToApi({ ...rest, applicants: _count.applications } as any)
}

jobsRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const { category, status } = req.query
    const jobs = await prisma.job.findMany({
      where: {
        ...(category && { category: String(category) }),
        status: status ? (String(status) as 'active' | 'paused' | 'completed') : 'active',
      },
      include: { _count: { select: { applications: true } } },
      orderBy: { createdAt: 'desc' },
    })
    res.json(jobs.map(withApplicantsCount))
  })
)

jobsRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const job = await prisma.job.findUnique({
      where: { id: req.params.id },
      include: { _count: { select: { applications: true } }, employer: { select: { name: true, businessName: true, companyLogoUrl: true } } },
    })
    if (!job) return res.status(404).json({ error: 'Empleo no encontrado.' })
    res.json(withApplicantsCount(job))
  })
)

jobsRouter.post(
  '/',
  requireAuth,
  requireRole('employer'),
  asyncHandler(async (req: AuthedRequest, res) => {
    const b = req.body ?? {}
    const required = ['title', 'description', 'location', 'address', 'category', 'payment', 'paymentType', 'duration', 'schedule', 'modality', 'startDate']
    const missing = required.filter((k) => b[k] === undefined || b[k] === null || b[k] === '')
    if (missing.length) {
      return res.status(400).json({ error: `Faltan campos requeridos: ${missing.join(', ')}` })
    }

    const paymentType = PAYMENT_TYPE_TO_DB[b.paymentType as keyof typeof PAYMENT_TYPE_TO_DB]
    const modality = MODALITY_TO_DB[b.modality as keyof typeof MODALITY_TO_DB]
    if (!paymentType || !modality) {
      return res.status(400).json({ error: 'paymentType o modality inválidos.' })
    }
    const scheduleType = b.scheduleType ? SCHEDULE_TYPE_TO_DB[b.scheduleType as keyof typeof SCHEDULE_TYPE_TO_DB] ?? null : null

    const job = await prisma.job.create({
      data: {
        employerId: req.user!.id,
        title: b.title,
        description: b.description,
        location: b.location,
        address: b.address,
        category: b.category,
        requirements: b.requirements ?? [],
        payment: parseInt(b.payment, 10),
        paymentType: paymentType as any,
        duration: b.duration,
        schedule: b.schedule,
        modality: modality as any,
        scheduleType: scheduleType as any,
        startDate: new Date(b.startDate),
        lat: b.lat ?? null,
        lng: b.lng ?? null,
      },
    })
    res.status(201).json(jobToApi({ ...job, applicants: 0 } as any))
  })
)

jobsRouter.patch(
  '/:id',
  requireAuth,
  requireRole('employer'),
  asyncHandler(async (req: AuthedRequest, res) => {
    const job = await prisma.job.findUnique({ where: { id: req.params.id } })
    if (!job) return res.status(404).json({ error: 'Empleo no encontrado.' })
    if (job.employerId !== req.user!.id) return res.status(403).json({ error: 'Este empleo no te pertenece.' })

    const b = req.body ?? {}
    const updated = await prisma.job.update({
      where: { id: req.params.id },
      data: {
        ...(b.title !== undefined && { title: b.title }),
        ...(b.description !== undefined && { description: b.description }),
        ...(b.status !== undefined && { status: b.status }),
        ...(b.isFeatured !== undefined && { isFeatured: b.isFeatured }),
      },
    })
    res.json(updated)
  })
)

/** Postularse a un empleo (young). */
jobsRouter.post(
  '/:id/apply',
  requireAuth,
  requireRole('young'),
  asyncHandler(async (req: AuthedRequest, res) => {
    const job = await prisma.job.findUnique({ where: { id: req.params.id } })
    if (!job) return res.status(404).json({ error: 'Empleo no encontrado.' })

    const existing = await prisma.application.findUnique({
      where: { jobId_youngId: { jobId: req.params.id, youngId: req.user!.id } },
    })
    if (existing) return res.status(409).json({ error: 'Ya postulaste a este empleo.' })

    const application = await prisma.application.create({
      data: { jobId: req.params.id, youngId: req.user!.id },
    })
    res.status(201).json(application)
  })
)

/** Guardar/quitar de guardados (young). */
jobsRouter.post(
  '/:id/save',
  requireAuth,
  requireRole('young'),
  asyncHandler(async (req: AuthedRequest, res) => {
    await prisma.savedJob.upsert({
      where: { jobId_youngId: { jobId: req.params.id, youngId: req.user!.id } },
      create: { jobId: req.params.id, youngId: req.user!.id },
      update: {},
    })
    res.status(204).end()
  })
)

jobsRouter.delete(
  '/:id/save',
  requireAuth,
  requireRole('young'),
  asyncHandler(async (req: AuthedRequest, res) => {
    await prisma.savedJob
      .delete({ where: { jobId_youngId: { jobId: req.params.id, youngId: req.user!.id } } })
      .catch(() => null)
    res.status(204).end()
  })
)

/** Postulantes de un empleo (employer, dueño del empleo). */
jobsRouter.get(
  '/:id/applications',
  requireAuth,
  requireRole('employer'),
  asyncHandler(async (req: AuthedRequest, res) => {
    const job = await prisma.job.findUnique({ where: { id: req.params.id } })
    if (!job) return res.status(404).json({ error: 'Empleo no encontrado.' })
    if (job.employerId !== req.user!.id) return res.status(403).json({ error: 'Este empleo no te pertenece.' })

    const applications = await prisma.application.findMany({
      where: { jobId: req.params.id },
      include: { young: true },
      orderBy: { appliedAt: 'desc' },
    })
    res.json(applications)
  })
)
