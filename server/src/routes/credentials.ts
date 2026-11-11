import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { asyncHandler } from '../lib/asyncHandler'
import { requireAuth, AuthedRequest } from '../middleware/auth'
import { requireRole } from '../middleware/requireRole'

export const credentialsRouter = Router()

/** Credenciales realmente obtenidas por el usuario logueado (join credential + user_credential). */
credentialsRouter.get(
  '/me',
  requireAuth,
  requireRole('young'),
  asyncHandler(async (req: AuthedRequest, res) => {
    const earned = await prisma.userCredential.findMany({
      where: { youngId: req.user!.id },
      include: { credential: true },
      orderBy: { earnedDate: 'desc' },
    })
    res.json(earned.map((e) => ({ ...e.credential, earnedDate: e.earnedDate, verificationId: e.verificationId })))
  })
)

/** Detalle de una credencial propia (id = id del catálogo `credentials`). */
credentialsRouter.get(
  '/:id',
  requireAuth,
  requireRole('young'),
  asyncHandler(async (req: AuthedRequest, res) => {
    const earned = await prisma.userCredential.findUnique({
      where: { credentialId_youngId: { credentialId: req.params.id, youngId: req.user!.id } },
      include: { credential: true },
    })
    if (!earned) return res.status(404).json({ error: 'No has obtenido esta credencial.' })
    res.json({ ...earned.credential, earnedDate: earned.earnedDate, verificationId: earned.verificationId })
  })
)
