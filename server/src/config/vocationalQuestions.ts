// Config estática del test vocacional — portada desde src/data/vocationalQuestions.js.
// No se persiste en base de datos: nunca cambia en runtime y no hay UI de admin para
// editarla. Solo los *resultados* de cada intento se guardan (tabla vocational_results).

export type ArchetypeKey = 'tecnico' | 'creativo' | 'liderazgo' | 'servicio'

export interface Archetype {
  key: ArchetypeKey
  label: string
  icon: string
  summary: string
  strengths: string[]
  reinforceLabel: string
  jobCategories: string[]
  courseCategories: string[]
}

export const ARCHETYPES: Record<ArchetypeKey, Archetype> = {
  tecnico: {
    key: 'tecnico',
    label: 'Lógica y Tecnología',
    icon: 'terminal',
    summary:
      'Disfrutas resolver problemas paso a paso y te sientes cómodo con herramientas digitales y análisis de datos.',
    strengths: ['Pensamiento lógico', 'Resolución de problemas', 'Curiosidad tecnológica'],
    reinforceLabel: 'Herramientas digitales',
    jobCategories: ['Tecnología'],
    courseCategories: ['Desarrollo Web', 'Data Science', 'Ciberseguridad'],
  },
  creativo: {
    key: 'creativo',
    label: 'Creatividad Digital',
    icon: 'palette',
    summary: 'Tienes ojo para lo visual y disfrutas crear contenido que comunique ideas de forma atractiva.',
    strengths: ['Creatividad', 'Sentido estético', 'Comunicación visual'],
    reinforceLabel: 'Diseño y edición',
    jobCategories: ['Marketing', 'Fotografía'],
    courseCategories: ['Diseño Gráfico', 'Diseño UI/UX', 'Marketing Digital'],
  },
  liderazgo: {
    key: 'liderazgo',
    label: 'Liderazgo y Organización',
    icon: 'groups',
    summary: 'Te motiva coordinar personas y procesos, y te apoyas en la organización para lograr resultados.',
    strengths: ['Organización', 'Trabajo en equipo', 'Responsabilidad'],
    reinforceLabel: 'Gestión del tiempo',
    jobCategories: ['Eventos', 'Educación'],
    courseCategories: ['Soft Skills', 'Ofimática'],
  },
  servicio: {
    key: 'servicio',
    label: 'Servicio y Ventas',
    icon: 'support_agent',
    summary: 'Te resulta natural conectar con las personas, entender lo que necesitan y ayudarlas a resolverlo.',
    strengths: ['Empatía', 'Comunicación', 'Orientación al cliente'],
    reinforceLabel: 'Redacción profesional',
    jobCategories: ['Ventas', 'Atención al cliente', 'Reparto'],
    courseCategories: ['Ofimática', 'Soft Skills'],
  },
}

export interface QuestionOption {
  archetype: ArchetypeKey
  title: string
  description: string
}

export interface Question {
  id: number
  question: string
  options: QuestionOption[]
}

export const QUESTIONS: Question[] = [
  {
    id: 1,
    question: '¿Qué tipo de actividad te generaría más satisfacción en un día de trabajo?',
    options: [
      { archetype: 'tecnico', title: 'Resolver un error técnico', description: 'Te concentras hasta encontrar la causa exacta de una falla.' },
      { archetype: 'creativo', title: 'Diseñar una pieza gráfica', description: 'Disfrutas crear algo visualmente atractivo desde cero.' },
      { archetype: 'liderazgo', title: 'Coordinar un equipo', description: 'Te gusta organizar quién hace qué y cuándo.' },
      { archetype: 'servicio', title: 'Ayudar a un cliente', description: 'Sientes satisfacción al resolver la necesidad de alguien.' },
    ],
  },
  {
    id: 2,
    question: 'Cuando trabajas en un proyecto grupal, ¿qué rol asumes naturalmente?',
    options: [
      { archetype: 'tecnico', title: 'El que revisa que todo funcione', description: 'Te aseguras de que los detalles técnicos estén bien.' },
      { archetype: 'creativo', title: 'El que propone ideas originales', description: 'Aportas soluciones visuales o poco convencionales.' },
      { archetype: 'liderazgo', title: 'El que organiza tareas y plazos', description: 'Defines quién hace qué y para cuándo.' },
      { archetype: 'servicio', title: 'El que cuida al equipo', description: 'Te aseguras de que todos estén cómodos y escuchados.' },
    ],
  },
  {
    id: 3,
    question: '¿Qué tipo de contenido disfrutas consumir en tu tiempo libre?',
    options: [
      { archetype: 'tecnico', title: 'Tutoriales de tecnología', description: 'Retos de programación, apps o gadgets nuevos.' },
      { archetype: 'creativo', title: 'Diseño y fotografía', description: 'Edición de video, arte digital o moda.' },
      { archetype: 'liderazgo', title: 'Historias de liderazgo', description: 'Casos de gestión de equipos o proyectos.' },
      { archetype: 'servicio', title: 'Comunicación y atención', description: 'Contenido sobre trato al público o ventas.' },
    ],
  },
  {
    id: 4,
    question: 'Un amigo te pide ayuda con su emprendimiento. ¿Qué le ofreces primero?',
    options: [
      { archetype: 'tecnico', title: 'Automatizar un proceso', description: 'Buscas mejorar algo digital o repetitivo.' },
      { archetype: 'creativo', title: 'Crear su imagen de marca', description: 'Diseñas su logo, publicaciones o presentación.' },
      { archetype: 'liderazgo', title: 'Planear pasos y responsables', description: 'Ayudas a ordenar el plan y quién hace qué.' },
      { archetype: 'servicio', title: 'Hablar con sus clientes', description: 'Investigas qué necesitan realmente para ayudarlos mejor.' },
    ],
  },
  {
    id: 5,
    question: '¿Qué frase te representa mejor?',
    options: [
      { archetype: 'tecnico', title: '"Me gusta entender cómo funcionan las cosas."', description: 'Vas más allá de lo evidente para entender el sistema.' },
      { archetype: 'creativo', title: '"Veo oportunidades para hacerlo más atractivo."', description: 'Notas lo que se puede mejorar visualmente.' },
      { archetype: 'liderazgo', title: '"Me siento cómodo tomando decisiones."', description: 'No te incomoda asumir responsabilidad por el grupo.' },
      { archetype: 'servicio', title: '"Disfruto escuchar y ayudar a otros."', description: 'Te importa genuinamente lo que otros necesitan.' },
    ],
  },
  {
    id: 6,
    question: 'En la escuela o universidad, ¿qué actividades disfrutabas más?',
    options: [
      { archetype: 'tecnico', title: 'Matemáticas o informática', description: 'Materias con lógica, cálculo o programación.' },
      { archetype: 'creativo', title: 'Artes o producción audiovisual', description: 'Espacios para expresarte creativamente.' },
      { archetype: 'liderazgo', title: 'Organización de eventos', description: 'Representación estudiantil o comités.' },
      { archetype: 'servicio', title: 'Actividades sociales', description: 'Espacios de apoyo o atención a compañeros.' },
    ],
  },
  {
    id: 7,
    question: '¿Cómo prefieres resolver un problema inesperado?',
    options: [
      { archetype: 'tecnico', title: 'Analizando datos paso a paso', description: 'Pruebas soluciones de forma metódica.' },
      { archetype: 'creativo', title: 'Buscando un enfoque distinto', description: 'Te alejas de lo obvio para innovar.' },
      { archetype: 'liderazgo', title: 'Definiendo un plan claro', description: 'Delegas tareas y estableces prioridades.' },
      { archetype: 'servicio', title: 'Conversando con los involucrados', description: 'Entiendes la situación desde las personas.' },
    ],
  },
  {
    id: 8,
    question: '¿Qué logro te haría sentir más orgulloso/a?',
    options: [
      { archetype: 'tecnico', title: 'Construir algo que funcione bien', description: 'Una herramienta, sistema o proceso sólido.' },
      { archetype: 'creativo', title: 'Que reconozcan tu creatividad', description: 'Que tu trabajo destaque por su diseño.' },
      { archetype: 'liderazgo', title: 'Que tu equipo cumpla sus metas', description: 'Gracias a tu organización y liderazgo.' },
      { archetype: 'servicio', title: 'Que un cliente quede feliz', description: 'Gracias a la ayuda que le brindaste.' },
    ],
  },
  {
    id: 9,
    question: '¿Qué tipo de microempleo te llamaría más la atención?',
    options: [
      { archetype: 'tecnico', title: 'Soporte técnico', description: 'Tareas relacionadas con tecnología y sistemas.' },
      { archetype: 'creativo', title: 'Community manager', description: 'Diseño de piezas y contenido para redes.' },
      { archetype: 'liderazgo', title: 'Coordinación de un evento', description: 'Organizar un grupo de trabajo o actividad.' },
      { archetype: 'servicio', title: 'Atención al cliente o ventas', description: 'Trato directo con clientes en punto de venta.' },
    ],
  },
  {
    id: 10,
    question: 'Cuando algo no sale como esperabas, ¿qué haces primero?',
    options: [
      { archetype: 'tecnico', title: 'Investigas la causa raíz', description: 'Analizas antes de actuar.' },
      { archetype: 'creativo', title: 'Buscas una forma original', description: 'Piensas en una alternativa poco convencional.' },
      { archetype: 'liderazgo', title: 'Reorganizas el plan', description: 'Redefines tareas y responsabilidades.' },
      { archetype: 'servicio', title: 'Hablas con los afectados', description: 'Buscas calmar la situación y entender qué pasó.' },
    ],
  },
]
