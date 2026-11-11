import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { asyncHandler } from '../lib/asyncHandler'
import { requireAuth, AuthedRequest } from '../middleware/auth'

export const notificationsRouter = Router()

notificationsRouter.get(
  '/me',
  requireAuth,
  asyncHandler(async (req: AuthedRequest, res) => {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
    })
    res.json(notifications)
  })
)

notificationsRouter.patch(
  '/:id/read',
  requireAuth,
  asyncHandler(async (req: AuthedRequest, res) => {
    const notification = await prisma.notification.findUnique({ where: { id: req.params.id } })
    if (!notification || notification.userId !== req.user!.id) {
      return res.status(404).json({ error: 'Notificación no encontrada.' })
    }
    const updated = await prisma.notification.update({ where: { id: req.params.id }, data: { read: true } })
    res.json(updated)
  })
)

notificationsRouter.patch(
  '/read-all',
  requireAuth,
  asyncHandler(async (req: AuthedRequest, res) => {
    await prisma.notification.updateMany({ where: { userId: req.user!.id, read: false }, data: { read: true } })
    res.status(204).end()
  })
)
