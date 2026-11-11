import { NextFunction, Response } from 'express'
import { AuthedRequest } from './auth'

/** Debe usarse después de `requireAuth` — asume que req.user ya está resuelto. */
export function requireRole(...roles: Array<'young' | 'employer' | 'admin'>) {
  return (req: AuthedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'No tienes permiso para esta acción.' })
    }
    next()
  }
}
