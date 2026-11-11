import { NextFunction, Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { supabaseAdmin } from '../lib/supabaseAdmin'

export interface AuthedRequest extends Request {
  /** Presente tras `verifySupabaseToken` — identidad cruda del token, sin perfil todavía. */
  auth?: { id: string; email: string }
  /** Presente tras `requireAuth` — perfil ya resuelto en `profiles`. */
  user?: {
    id: string
    email: string
    role: 'young' | 'employer' | 'admin'
  }
}

/**
 * Verifica el access_token emitido por Supabase Auth, sin exigir que ya exista
 * una fila en `profiles` — se usa en `POST /api/profiles` (creación del perfil
 * justo después del signup).
 *
 * La verificación se delega al propio Supabase (`auth.getUser`) en vez de
 * decodificar el JWT a mano: este proyecto firma tokens con llaves asimétricas
 * (ECC P-256, ver Project Settings > JWT Keys), no con el JWT Secret "legacy"
 * (HS256), así que dejamos que el SDK de Supabase resuelva la verificación
 * correctamente sin importar qué esquema de firma esté activo.
 */
export async function verifySupabaseToken(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  const token = header?.startsWith('Bearer ') ? header.slice('Bearer '.length) : null

  if (!token) {
    return res.status(401).json({ error: 'Falta el token de autenticación.' })
  }

  const { data, error } = await supabaseAdmin.auth.getUser(token)
  if (error || !data.user) {
    return res.status(401).json({ error: 'Token inválido o expirado.' })
  }

  req.auth = { id: data.user.id, email: data.user.email ?? '' }
  next()
}

/** Verifica el token y además exige que ya exista un perfil (`profiles`) para ese usuario. */
export async function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  await verifySupabaseToken(req, res, async () => {
    const profile = await prisma.profile.findUnique({ where: { userId: req.auth!.id } })
    if (!profile) {
      return res.status(401).json({ error: 'No existe un perfil para este usuario. Completa el registro.' })
    }
    req.user = { id: req.auth!.id, email: profile.email, role: profile.role }
    next()
  })
}
