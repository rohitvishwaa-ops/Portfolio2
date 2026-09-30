export const profile = {
  name: 'A Rohit Vishwa',
  role: 'Full-stack developer',
  tagline: 'Building ideas into things that work.',
  email: 'rohitvishwaa@gmail.com',
  github: 'https://github.com/rohitvishwaa-ops',
  linkedin: 'https://www.linkedin.com/in/arohivishwa/',
  resume: '/Rohit_Vishwa_Resume.pdf',
  photo: '/media/rohit.webp',
}

export type Project = {
  id: string
  name: string
  context: string
  summary: string
  points: string[]
  stack: string[]
  live?: string
  code: string
  image?: string
}

export const experience: Project = {
  id: 'imd',
  name: 'SYNOP Data Decoder and API',
  context: 'Software Development Intern, India Meteorological Department, Meenambakkam. 1 month.',
  summary:
    'Raw SYNOP weather codes were readable only by IMD staff. I built a decoder that turns them into plain English and shipped it as a working webpage.',
  points: [
    'Decodes user-entered surface observation codes into structured weather data',
    'Designed APIs to process and serve the decoded observations',
  ],
  stack: ['Python', 'REST APIs', 'Meteorological data'],
  code: 'https://github.com/rohitvishwaa-ops/SYNOP-Data-Decoding-and-API-Development-Using-IMD-Dataset',
}

export const projects: Project[] = [
  {
    id: 'spendsmart',
    name: 'SpendSmart',
    context: 'Personal finance tracker',
    summary:
      'Track, analyse and trim your spending. Interactive dashboards turn raw expenses into habits you can actually see.',
    points: [
      'Secure sign-in and real-time storage with Firebase Auth and Firestore',
      'Spending trends visualised with Chart.js',
    ],
    stack: ['React', 'JavaScript', 'Firebase', 'Chart.js'],
    live: 'https://spendsmart-steel.vercel.app/',
    code: 'https://github.com/rohitvishwaa-ops/spendsmart',
    image: '/media/spendsmart-dash.webp',
  },
  {
    id: 'vital',
    name: 'Vital AI',
    context: 'Hackathon build, team of 3',
    summary:
      'An ML model that reads patient health parameters and past reports to estimate the risk of heart disease, supporting early diagnosis.',
    points: [
      'Model trained with Scikit-learn and served through a FastAPI backend',
      'Designed the input interface and deployed it end to end',
    ],
    stack: ['Python', 'FastAPI', 'Scikit-learn', 'React'],
    live: 'https://vital-ai-frontend.onrender.com/',
    code: 'https://github.com/rohitvishwaa-ops/health-predictor',
    image: '/media/vital-dash.webp',
  },
  {
    id: 'nomad',
    name: 'NomadAI',
    context: 'AI trip planner',
    summary:
      'Plan a whole trip in one place. Book flights and hotels, invite friends to co-plan, and get AI recommendations and destination guides.',
    points: [
      'Gemini API powers the itinerary and recommendation engine',
      'Supabase backend, OpenStreetMap search, 3D visuals with React Three Fiber',
    ],
    stack: ['Next.js', 'Tailwind CSS', 'Gemini API', 'Supabase'],
    live: 'https://ai-trip-planner-woad-eight.vercel.app/',
    code: 'https://github.com/rohitvishwaa-ops/AI-Trip-Planner',
    image: '/media/nomad-dash.webp',
  },
]

export const skills: { group: string; items: string[] }[] = [
  { group: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Framer Motion', 'React Three Fiber'] },
  { group: 'Backend and data', items: ['Python', 'FastAPI', 'Firebase', 'Supabase', 'MySQL', 'REST APIs'] },
  { group: 'AI and ML', items: ['Scikit-learn', 'Gemini API'] },
  { group: 'Also', items: ['Java', 'C / C++', 'Git', 'GitHub', 'Vercel', 'Render'] },
]

/** Chapters of the scroll world, in flight order. `label` feeds the nav rail. */
export const chapters = [
  { id: 'home', label: 'Hello' },
  { id: 'about', label: 'About' },
  { id: 'imd', label: 'IMD' },
  { id: 'spendsmart', label: 'SpendSmart' },
  { id: 'vital', label: 'Vital AI' },
  { id: 'nomad', label: 'NomadAI' },
  { id: 'skills', label: 'Toolkit' },
  { id: 'contact', label: 'Contact' },
] as const
