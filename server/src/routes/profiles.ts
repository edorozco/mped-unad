import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { asyncHandler } from '../lib/asyncHandler'
import { requireAuth, verifySupabaseToken, AuthedRequest } from '../middleware/auth'

export const profilesRouter = Router()

/** Crea el perfil justo después de `supabase.auth.signUp()`. Requiere token válido, no perfil previo. */
profilesRouter.post(
  '/',
  verifySupabaseToken,
  asyncHandler(async (req: AuthedRequest, res) => {
    const { role, name, city, businessName, nit, consents } = req.body ?? {}

    if (!role || !['young', 'employer'].includes(role) || !name) {
      return res.status(400).json({ error: 'Faltan campos requeridos (role, name).' })
    }
    if (role === 'employer' && (!businessName || !nit)) {
      return res.status(400).json({ error: 'Las empresas deben indicar businessName y nit.' })
    }

    const existing = await prisma.profile.findUnique({ where: { userId: req.auth!.id } })
    if (existing) {
      return res.status(409).json({ error: 'Ya existe un perfil para este usuario.' })
    }

    const now = new Date()
    const profile = await prisma.profile.create({
      data: {
        userId: req.auth!.id,
        email: req.auth!.email,
        role,
        name,
        city: city ?? null,
        businessName: role === 'employer' ? businessName : null,
        nit: role === 'employer' ? nit : null,
        consentDataProcessing: Boolean(consents?.data),
        consentDataProcessingAt: consents?.data ? now : null,
        consentAcademic: Boolean(consents?.academic),
        consentAcademicAt: consents?.academic ? now : null,
      },
    })

    res.status(201).json(profile)
  })
)

profilesRouter.get(
  '/me',
  requireAuth,
  asyncHandler(async (req: AuthedRequest, res) => {
    const profile = await prisma.profile.findUnique({ where: { userId: req.user!.id } })
    res.json(profile)
  })
)

profilesRouter.put(
  '/me',
  requireAuth,
  asyncHandler(async (req: AuthedRequest, res) => {
    const { name, city, photoUrl, skills, availability, interests, profileComplete, businessName, nit, companyLogoUrl } =
      req.body ?? {}

    const profile = await prisma.profile.update({
      where: { userId: req.user!.id },
      data: {
        ...(name !== undefined && { name }),
        ...(city !== undefined && { city }),
        ...(photoUrl !== undefined && { photoUrl }),
        ...(skills !== undefined && { skills }),
        ...(availability !== undefined && { availability }),
        ...(interests !== undefined && { interests }),
        ...(profileComplete !== undefined && { profileComplete }),
        ...(businessName !== undefined && { businessName }),
        ...(nit !== undefined && { nit }),
        ...(companyLogoUrl !== undefined && { companyLogoUrl }),
      },
    })

    res.json(profile)
  })
)
