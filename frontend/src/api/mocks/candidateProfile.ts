import type { CandidateFullProfile, CandidateInvite, MicroChallenge } from '@/types/candidate'

export const mockCandidateFullProfile: CandidateFullProfile = {
  id: 'cand_8849',
  fullName: 'Алексей Сергеевич Голубев',
  avatarUrl: '',
  city: 'Москва',
  timezone: 'UTC+3 (МСК)',
  birthDate: '2001-04-18',
  age: 24,
  contacts: {
    email: 'alexey.go@huntme.dev',
    phone: '+7 (999) 845-12-30',
    telegram: '@alexey_fsp_go',
    github: 'https://github.com/alexey-fsp',
    portfolioUrl: 'https://alexey-dev.huntme.pro',
  },

  // Образование
  education: [
    {
      id: 'edu_1',
      level: 'bachelor',
      institution: 'НИУ ВШЭ (ФКН)',
      faculty: 'Факультет компьютерных наук',
      specialization: 'Прикладная математика и информатика',
      graduationYear: 2023,
    },
    {
      id: 'edu_2',
      level: 'master',
      institution: 'МФТИ (ФПМИ)',
      faculty: 'Физтех-школа прикладной математики и информатики',
      specialization: 'Высоконагруженные распределенные системы',
      graduationYear: 2025,
    },
  ],

  // Языки
  languages: [
    {
      id: 'lang_1',
      language: 'Русский',
      level: 'native',
    },
    {
      id: 'lang_2',
      language: 'Английский',
      level: 'C1',
    },
    {
      id: 'lang_3',
      language: 'Китайский',
      level: 'A2',
    },
  ],

  // Опыт и стек
  specialization: 'Backend',
  additionalSpecializations: ['DevOps & SRE', 'HighLoad'],
  experienceYears: 4,
  workHistory: [
    {
      id: 'work_1',
      company: 'Fintech Core Systems',
      role: 'Senior Go Developer',
      startDate: '2023-09',
      isCurrent: true,
      description:
        'Проектирование ядра платежного шлюза. Оптимизация задержек p99 с 140ms до 18ms под нагрузкой 85k RPS. Внедрение шардирования PostgreSQL и асинхронного клиринга через Kafka.',
      technologies: ['Go', 'PostgreSQL', 'Kafka', 'Redis', 'Kubernetes', 'gRPC'],
    },
    {
      id: 'work_2',
      company: 'VK Cloud Platform',
      role: 'Middle Backend Engineer',
      startDate: '2021-11',
      endDate: '2023-08',
      isCurrent: false,
      description:
        'Разработка сервисов биллинга и оркестрации виртуальных инстансов. Написание микросервисов на Go и Python (FastAPI).',
      technologies: ['Go', 'Python', 'FastAPI', 'Docker', 'PostgreSQL', 'RabbitMQ'],
    },
  ],
  skills: [
    'Go (Golang)',
    'PostgreSQL',
    'Kafka',
    'Redis',
    'Kubernetes',
    'Docker',
    'gRPC',
    'Distributed Systems',
    'HighLoad Architecture',
    'Linux / eBPF',
  ],
  softSkills: [
    'System Design',
    'Code Review',
    'Менторинг джуниоров',
    'Agile / Scrum',
    'Кросс-командные коммуникации',
  ],
  desiredSalary: 350000,
  workFormat: ['remote', 'hybrid'],
  relocationReady: false,

  // Квалификация
  claimedGrade: 'Senior',
  verifiedGrade: 'Senior',
  category: 'Backend-разработчик с опытом (Senior)',
  testingStatus: 'verified',
  lastTestDate: '2026-02-15',
  canRetakeTestAfter: '2026-05-15',

  // ФСП Достижения
  fspId: 'FSP-2026-8849',
  fspAchievements: [
    {
      id: 'fsp_1',
      title: 'Всероссийский турнир по алгоритмическому программированию ФСП',
      eventType: 'Чемпионат России',
      rank: '1 место (Золотой кубок)',
      date: '2025-11-20',
      score: 1840,
      sportsCategory: 'Мастер спорта России',
    },
    {
      id: 'fsp_2',
      title: 'Хакатон «Лидеры цифровой трансформации» (ЛЦТ)',
      eventType: 'Продуктовое программирование',
      rank: 'Победитель трека FinTech AI',
      date: '2025-06-12',
      score: 1250,
      sportsCategory: 'КМС',
    },
    {
      id: 'fsp_3',
      title: 'Кубок Москвы по спортивному программированию',
      eventType: 'Региональный кубок',
      rank: 'Топ-3 призер',
      date: '2024-10-05',
      score: 950,
      sportsCategory: '1 разряд',
    },
  ],

  // Активность
  activityScore: 98,
  lastActiveAt: 'Сегодня в 14:20',
  completedTasksCount: 14,

  // Приватность
  isSearchActive: true,
  privacyConsent152Accepted: true,
}

export const mockCandidateInvites: CandidateInvite[] = [
  {
    id: 'inv_101',
    companyName: 'Т-Банк (Центр Инноваций)',
    companyLogo: '',
    industry: 'Финтех и Банкинг',
    position: 'Senior HighLoad Go Engineer',
    salaryFrom: 360000,
    salaryTo: 450000,
    currency: 'RUB',
    description:
      'Ищем ведущего разработчика в команду распределенного процессинга. Задачи: проектирование fault-tolerant транзакционного движка, оптимизация производительности и менторинг.',
    requiredStack: ['Go', 'Kafka', 'PostgreSQL', 'ClickHouse', 'Kubernetes'],
    status: 'received',
    sentAt: '2 часа назад',
    contactsRevealed: false,
    recruiterContacts: {
      name: 'Елена Васильева',
      role: 'Lead Tech Recruiter',
      email: 'e.vasilieva@tbank.ru',
      telegram: '@elena_tbank_hr',
      phone: '+7 (916) 555-01-22',
    },
  },
  {
    id: 'inv_102',
    companyName: 'VK Cloud Core',
    companyLogo: '',
    industry: 'Облачные платформы',
    position: 'Архитектор распределенных систем (Go/Rust)',
    salaryFrom: 400000,
    salaryTo: 520000,
    currency: 'RUB',
    description:
      'Приглашаем в команду Cloud Native хранилищ. Разработка отказоустойчивых блочных хранилищ и сетевых интерфейсов нового поколения.',
    requiredStack: ['Go', 'Rust', 'Linux', 'eBPF', 'gRPC'],
    status: 'accepted',
    sentAt: 'Вчера в 17:40',
    contactsRevealed: true,
    recruiterContacts: {
      name: 'Дмитрий Романов',
      role: 'Staff Talent Partner',
      email: 'd.romanov@vk.team',
      telegram: '@dmitry_vk_recruiter',
      phone: '+7 (925) 444-90-11',
    },
  },
  {
    id: 'inv_103',
    companyName: 'Яндекс Доставка',
    companyLogo: '',
    industry: 'E-commerce & Логистика',
    position: 'Backend Developer (Маршрутизация и матчинг)',
    salaryFrom: 320000,
    salaryTo: 390000,
    currency: 'RUB',
    description:
      'Разработка алгоритмов динамической балансировки курьерской сети. Обработка миллионов пространственных запросов в секунду.',
    requiredStack: ['C++', 'Python', 'Go', 'PostgreSQL', 'Redis'],
    status: 'viewed',
    sentAt: '3 дня назад',
    contactsRevealed: false,
    recruiterContacts: {
      name: 'Мария Семенова',
      role: 'HR Business Partner',
      email: 'm.semenova@yandex-team.ru',
      telegram: '@maria_ydelivery',
    },
  },
]

export const mockMicroChallenges: MicroChallenge[] = [
  {
    id: 'chal_1',
    title: 'Оптимизация deadlock в PostgreSQL при конкурентных транзакциях',
    specialization: 'Backend',
    difficulty: 'medium',
    timeMinutes: 15,
    rewardScore: 25,
    isCompleted: false,
    description:
      'Даны две одновременные транзакции с перекрестным обновлением связанных таблиц заказов и баланса. Найдите причину взаимной блокировки и перепишите SQL-запрос с использованием SELECT ... FOR UPDATE с детерминированным порядком ключей.',
    codeSnippet: `-- Transaction A:
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;`,
  },
  {
    id: 'chal_2',
    title: 'Реализация Round-Robin балансировщика с учетом весов узлов на Go',
    specialization: 'Backend / DevOps',
    difficulty: 'hard',
    timeMinutes: 20,
    rewardScore: 40,
    isCompleted: false,
    description:
      'Реализуйте потокобезопасную структуру WeightedRoundRobin в Go для распределения трафика между инстансами с весами [1, 3, 2].',
  },
  {
    id: 'chal_3',
    title: 'Обработка Backpressure в Kafka потребителях',
    specialization: 'HighLoad',
    difficulty: 'easy',
    timeMinutes: 10,
    rewardScore: 15,
    isCompleted: true,
    description:
      'Как предотвратить OOM при резком всплеске сообщений в Kafka consumer group при медленном downstream-сервисе.',
  },
]
