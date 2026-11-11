import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { asyncHandler } from '../lib/asyncHandler'
import { requireAuth, AuthedRequest } from '../middleware/auth'
import { requireRole } from '../middleware/requireRole'
import { QUESTIONS, ARCHETYPES } from '../config/vocationalQuestions'

export const vocationalTestRouter = Router()

vocationalTestRouter.get('/questions', (_req, res) => {
  res.json({ questions: QUESTIONS, archetypes: ARCHETYPES })
})

vocationalTestRouter.post(
  '/results',
  requireAuth,
  requireRole('young'),
  asyncHandler(async (req: AuthedRequest, res) => {
    const { counts, totalQuestions } = req.body ?? {}
    if (!counts || typeof totalQuestions !== 'number') {
      return res.status(400).json({ error: 'Faltan counts o totalQuestions.' })
    }

    const result = await prisma.vocationalResult.create({
      data: { youngId: req.user!.id, counts, totalQuestions },
    })
    res.status(201).json(result)
  })
)

vocationalTestRouter.get(
  '/results/me/latest',
  requireAuth,
  requireRole('young'),
  asyncHandler(async (req: AuthedRequest, res) => {
    const result = await prisma.vocationalResult.findFirst({
      where: { youngId: req.user!.id },
      orderBy: { completedAt: 'desc' },
    })
    res.json(result)
  })
)
