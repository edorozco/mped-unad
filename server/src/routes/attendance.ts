import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { asyncHandler } from '../lib/asyncHandler'
import { requireAuth, AuthedRequest } from '../middleware/auth'
import { requireRole } from '../middleware/requireRole'

export const attendanceRouter = Router()

attendanceRouter.post(
  '/:jobId/check-in',
  requireAuth,
  requireRole('young'),
  asyncHandler(async (req: AuthedRequest, res) => {
    const record = await prisma.attendance.create({
      data: { jobId: req.params.jobId, youngId: req.user!.id, checkInAt: new Date() },
    })
    res.status(201).json(record)
  })
)

attendanceRouter.post(
  '/:id/check-out',
  requireAuth,
  requireRole('young'),
  asyncHandler(async (req: AuthedRequest, res) => {
    const record = await prisma.attendance.findUnique({ where: { id: req.params.id } })
    if (!record || record.youngId !== req.user!.id) {
      return res.status(404).json({ error: 'Registro de asistencia no encontrado.' })
    }
    if (!record.checkInAt) return res.status(400).json({ error: 'No se ha registrado el check-in.' })

    const checkOutAt = new Date()
    const hoursWorked = (checkOutAt.getTime() - record.checkInAt.getTime()) / (1000 * 60 * 60)

    const updated = await prisma.attendance.update({
      where: { id: req.params.id },
      data: { checkOutAt, hoursWorked },
    })
    res.json(updated)
  })
)
