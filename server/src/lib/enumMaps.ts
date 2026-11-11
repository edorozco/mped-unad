// Prisma expone los enums por su identificador declarado en el schema (p.ej. `POR_DIA`),
// no por el valor mapeado en la base de datos (`@map("por día")`) — ni al escribir ni al
// leer. Estas tablas traducen entre los strings "humanos" que ya usa el frontend (y los
// JSON de datos demo) y los identificadores que Prisma Client espera/devuelve.

function invert<T extends Record<string, string>>(map: T): Record<string, string> {
  return Object.fromEntries(Object.entries(map).map(([k, v]) => [v, k]))
}

export const PAYMENT_TYPE_TO_DB = {
  'por día': 'POR_DIA',
  'por hora': 'POR_HORA',
  'por evento': 'POR_EVENTO',
} as const
export const PAYMENT_TYPE_FROM_DB = invert(PAYMENT_TYPE_TO_DB)

export const MODALITY_TO_DB = {
  Presencial: 'PRESENCIAL',
  Remoto: 'REMOTO',
  Híbrido: 'HIBRIDO',
} as const
export const MODALITY_FROM_DB = invert(MODALITY_TO_DB)

export const SCHEDULE_TYPE_TO_DB = {
  'Medio Tiempo': 'MEDIO_TIEMPO',
  'Fines de Semana': 'FINES_DE_SEMANA',
  'Por Horas': 'POR_HORAS',
  Nocturno: 'NOCTURNO',
} as const
export const SCHEDULE_TYPE_FROM_DB = invert(SCHEDULE_TYPE_TO_DB)

export const COURSE_LEVEL_TO_DB = {
  Principiante: 'PRINCIPIANTE',
  Intermedio: 'INTERMEDIO',
  Avanzado: 'AVANZADO',
  Todos: 'TODOS',
} as const
export const COURSE_LEVEL_FROM_DB = invert(COURSE_LEVEL_TO_DB)

export const LESSON_TYPE_TO_DB = {
  video: 'VIDEO',
  pdf: 'PDF',
} as const
export const LESSON_TYPE_FROM_DB = invert(LESSON_TYPE_TO_DB)

export function jobToApi<T extends { paymentType: string; modality: string; scheduleType: string | null }>(job: T) {
  return {
    ...job,
    paymentType: PAYMENT_TYPE_FROM_DB[job.paymentType] ?? job.paymentType,
    modality: MODALITY_FROM_DB[job.modality] ?? job.modality,
    scheduleType: job.scheduleType ? SCHEDULE_TYPE_FROM_DB[job.scheduleType] ?? job.scheduleType : null,
  }
}

export function courseToApi<T extends { level: string; modules?: Array<{ lessons?: Array<{ type: string }> }> }>(course: T) {
  return {
    ...course,
    level: COURSE_LEVEL_FROM_DB[course.level] ?? course.level,
    modules: course.modules?.map((mod) => ({
      ...mod,
      lessons: mod.lessons?.map((lesson) => ({ ...lesson, type: LESSON_TYPE_FROM_DB[lesson.type] ?? lesson.type })),
    })),
  }
}
