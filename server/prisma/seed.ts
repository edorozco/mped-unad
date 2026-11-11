import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { supabaseAdmin } from '../src/lib/supabaseAdmin'
import { PAYMENT_TYPE_TO_DB, MODALITY_TO_DB, SCHEDULE_TYPE_TO_DB, COURSE_LEVEL_TO_DB, LESSON_TYPE_TO_DB } from '../src/lib/enumMaps'

// Reutiliza los JSON de demo del frontend como datos semilla en vez de reescribirlos a mano.
import demoJobs from '../../src/data/demoJobs.json'
import demoCourses from '../../src/data/demoCourses.json'
import demoCredentials from '../../src/data/demoCredentials.json'

const prisma = new PrismaClient()

const DEMO_YOUNG = { email: 'joven@demo.local', password: 'demo123', name: 'Usuario Demo', city: 'medellin' }
const DEMO_EMPLOYER = { email: 'empleador@demo.local', password: 'demo123', name: 'Empresa Demo', businessName: 'MPED Demo S.A.S.', nit: '900123456-7', city: 'medellin' }

async function getOrCreateAuthUser(email: string, password: string) {
  const { data: existingList } = await supabaseAdmin.auth.admin.listUsers()
  const existing = existingList.users.find((u) => u.email === email)
  if (existing) return existing

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })
  if (error || !data.user) throw new Error(`No se pudo crear el usuario ${email}: ${error?.message}`)
  return data.user
}

async function main() {
  console.log('Creando/verificando usuarios demo en Supabase Auth...')
  const youngAuth = await getOrCreateAuthUser(DEMO_YOUNG.email, DEMO_YOUNG.password)
  const employerAuth = await getOrCreateAuthUser(DEMO_EMPLOYER.email, DEMO_EMPLOYER.password)

  const young = await prisma.profile.upsert({
    where: { userId: youngAuth.id },
    create: {
      userId: youngAuth.id,
      role: 'young',
      name: DEMO_YOUNG.name,
      email: DEMO_YOUNG.email,
      city: DEMO_YOUNG.city,
      profileComplete: true,
      skills: ['Atención al cliente', 'Ventas', 'Comunicación'],
      interests: ['Ventas', 'Tecnología'],
    },
    update: {},
  })

  const employer = await prisma.profile.upsert({
    where: { userId: employerAuth.id },
    create: {
      userId: employerAuth.id,
      role: 'employer',
      name: DEMO_EMPLOYER.name,
      email: DEMO_EMPLOYER.email,
      city: DEMO_EMPLOYER.city,
      businessName: DEMO_EMPLOYER.businessName,
      nit: DEMO_EMPLOYER.nit,
    },
    update: {},
  })

  console.log(`Usuarios listos: young=${young.userId} employer=${employer.userId}`)

  console.log(`Sembrando ${demoJobs.length} empleos...`)
  for (const job of demoJobs) {
    await prisma.job.create({
      data: {
        employerId: employer.userId,
        title: job.title,
        description: job.description,
        location: job.location,
        address: job.address,
        category: job.category,
        requirements: job.requirements,
        payment: job.payment,
        paymentType: PAYMENT_TYPE_TO_DB[job.paymentType as keyof typeof PAYMENT_TYPE_TO_DB] as any,
        duration: job.duration,
        schedule: job.schedule,
        modality: MODALITY_TO_DB[job.modality as keyof typeof MODALITY_TO_DB] as any,
        scheduleType: (job as any).scheduleType
          ? (SCHEDULE_TYPE_TO_DB[(job as any).scheduleType as keyof typeof SCHEDULE_TYPE_TO_DB] as any)
          : null,
        startDate: new Date(job.startDate),
        isFeatured: job.isFeatured,
        status: job.status as any,
        lat: job.lat,
        lng: job.lng,
      },
    })
  }

  console.log(`Sembrando ${demoCourses.length} cursos...`)
  for (const course of demoCourses) {
    await prisma.course.create({
      data: {
        title: course.title,
        shortDescription: course.shortDescription,
        category: course.category,
        level: COURSE_LEVEL_TO_DB[course.level as keyof typeof COURSE_LEVEL_TO_DB] as any,
        duration: course.duration,
        rating: course.rating,
        reviewsCount: course.reviews,
        tags: course.tags,
        featured: course.featured,
        icon: course.icon,
        badgeName: course.badgeName,
        whatYouWillLearn: course.whatYouWillLearn,
        requirements: course.requirements,
        instructor: course.instructor,
        modules: {
          create: course.modules.map((mod, modIndex) => ({
            title: mod.title,
            locked: mod.locked,
            position: modIndex,
            lessons: mod.lessons
              ? {
                  create: mod.lessons.map((lesson, lessonIndex) => ({
                    title: lesson.title,
                    duration: lesson.duration,
                    type: LESSON_TYPE_TO_DB[lesson.type as keyof typeof LESSON_TYPE_TO_DB] as any,
                    position: lessonIndex,
                  })),
                }
              : undefined,
          })),
        },
      },
    })
  }

  console.log(`Sembrando ${demoCredentials.length} credenciales (catálogo)...`)
  const createdCredentials = []
  for (const credential of demoCredentials) {
    const created = await prisma.credential.create({
      data: {
        name: credential.name,
        description: credential.description,
        icon: credential.icon,
        imageUrl: credential.image || null,
        category: credential.category,
        skills: credential.skills,
      },
    })
    createdCredentials.push({ ...created, earnedDate: credential.earnedDate })
  }

  // Otorga al young de demo la primera credencial del catálogo, para poder probar
  // el flujo de "mis credenciales" end-to-end sin depender de lógica de negocio
  // de otorgamiento automático (que no existe hoy).
  if (createdCredentials.length > 0) {
    const first = createdCredentials[0]
    await prisma.userCredential.create({
      data: {
        credentialId: first.id,
        youngId: young.userId,
        earnedDate: new Date(first.earnedDate),
        verificationId: `MPED-${first.id.slice(0, 8).toUpperCase()}-${first.category.slice(0, 2).toUpperCase()}`,
      },
    })
    console.log(`Credencial "${first.name}" otorgada al usuario demo joven.`)
  }

  console.log('Seed completo.')
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
