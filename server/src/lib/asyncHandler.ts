import { NextFunction, Request, Response } from 'express'

type Handler = (req: Request, res: Response, next: NextFunction) => Promise<unknown>

/** Envuelve un handler async para que sus rechazos lleguen al errorHandler de Express. */
export function asyncHandler(fn: Handler) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next)
  }
}
