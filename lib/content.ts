import type { Locale } from "@/lib/i18n";
import type { Profile, Project } from "@/lib/types";

type ProfileCopy = Pick<Profile, "headline" | "roles" | "bio" | "location" | "company" | "quote" | "quoteTranslation" | "interests" | "experience" | "education">;
type ProjectCopy = Pick<Project, "name" | "description" | "longDescription" | "category">;

const profileCopy: Partial<Record<Locale, Partial<ProfileCopy>>> = {
  uz: {
    headline: "Tezkor va zamonaviy web-ilovalar yaratuvchi frontend dasturchi",
    roles: ["Frontend dasturchi", "React va Next.js dasturchisi", "TypeScript ishqibozi", "Mobile-first UI yaratuvchi"],
    bio: [
      "Men Xorazmda yashovchi frontend dasturchi Shuhrat Madaminovman. HTML, CSS va JavaScriptdan boshlab, hozir React, Next.js va TypeScript bilan to'liq ilovalar yarataman.",
      "Hozir Xonqa IT Parkda (2024–2026) tahsil olyapman va taxminan ikki yillik amaliy tajribaga ega Junior+ darajada ishlayman. Ikki frontend va bir backend dasturchidan iborat jamoada ishlash orqali umumiy API shartnomasi asosida ishlashni o'rgandim.",
      "Asosiy yo'nalishim React ekotizimi va mobile-first dizayn. Figma dizaynlarini pixel-perfect, qulay interfeysga aylantirishga e'tibor beraman: toza komponent arxitekturasi, halol loading/error holatlari va o'qilishi oson kod.",
    ],
    location: "Xorazm, O'zbekiston",
    company: "Xonqa IT Park — talaba (2024–2026)",
    quote: "Har bir kichik qadam katta maqsadga olib boradi.",
    quoteTranslation: "Har bir kichik qadam katta maqsadga olib boradi.",
    interests: ["Kod yozishda musiqa bilan diqqatni jamlash — Konsta va sokin piano.", "Har kuni yangi texnologiyani sinab ko'rish."],
    experience: [
      { role: "Frontend dasturchi", company: "Freelance va jamoaviy loyihalar", period: "2024 — Hozirgi vaqt", location: "Xorazm, O'zbekiston", highlights: ["Maktabning ommaviy sayti uchun kontent admin paneliga ega platformani yaratdim va ishga tushirdim.", "Next.js App Routerda internet-do'kon va full-stack Kanban menejerini ishlab chiqdim.", "Ikki frontend va bir backend dasturchidan iborat jamoada umumiy API bilan ishladim."] },
      { role: "Frontend dasturlash talabasi", company: "Xonqa IT Park", period: "2024 — 2026", location: "Xonqa, O'zbekiston", highlights: ["HTML, CSS, JavaScript, React va zamonaviy vositalarni qamrab olgan ikki yillik amaliy dastur.", "O'qish bilan birga Junior+ darajadagi amaliy loyiha tajribasiga erishdim."] },
    ],
    education: [{ degree: "Frontend dasturlash", school: "Xonqa IT Park", period: "2024 — 2026", location: "Xonqa, Xorazm, O'zbekiston" }],
  },
  ru: {
    headline: "Frontend-разработчик быстрых и современных веб-приложений",
    roles: ["Frontend-разработчик", "Разработчик React и Next.js", "Любитель TypeScript", "Создатель mobile-first интерфейсов"],
    bio: [
      "Я Шухрат Мадаминов, frontend-разработчик из Хорезма, Узбекистан. Начав с HTML, CSS и JavaScript, сейчас я создаю полноценные приложения на React, Next.js и TypeScript.",
      "Сейчас я учусь в Xonqa IT Park (2024–2026) и работаю на уровне Junior+ с примерно двумя годами практики. В команде из двух frontend- и одного backend-разработчика я научился работать по общему API-контракту.",
      "Мой фокус — экосистема React и mobile-first дизайн. Я превращаю макеты Figma в точные и доступные интерфейсы и ценю чистую архитектуру компонентов, честные состояния загрузки и читаемый код.",
    ],
    location: "Хорезм, Узбекистан",
    company: "Xonqa IT Park — студент (2024–2026)",
    quote: "Каждый маленький шаг ведёт к большой цели.",
    quoteTranslation: "Каждый маленький шаг ведёт к большой цели.",
    interests: ["Сохраняю концентрацию под музыку — Конста и спокойное пианино.", "Каждый день пробую новую технологию."],
    experience: [
      { role: "Frontend-разработчик", company: "Фриланс и командные проекты", period: "2024 — Сейчас", location: "Хорезм, Узбекистан", highlights: ["Создал и запустил школьную платформу с админ-панелью для публичного сайта.", "Разработал интернет-магазин и full-stack Kanban-менеджер на Next.js App Router.", "Работал в команде из двух frontend- и одного backend-разработчика по общему API-контракту."] },
      { role: "Студент frontend-разработки", company: "Xonqa IT Park", period: "2024 — 2026", location: "Хонка, Узбекистан", highlights: ["Двухлетняя практическая программа по HTML, CSS, JavaScript, React и современным инструментам.", "Получил практический опыт уровня Junior+ параллельно с обучением."] },
    ],
    education: [{ degree: "Frontend-разработка", school: "Xonqa IT Park", period: "2024 — 2026", location: "Хонка, Хорезм, Узбекистан" }],
  },
};

const projectCopy: Record<string, Partial<Record<Locale, ProjectCopy>>> = {
  anime: {
    uz: { name: "Anime platformasi", description: "Next.js frontend va Express API asosidagi tezkor, media-ga boy anime qidiruv platformasi.", longDescription: "Anime izlash uchun to'liq mahsulot: responsive katalog, alohida Express backend, loading va bo'sh holatlar puxta ishlab chiqilgan.", category: "Full-Stack" },
    ru: { name: "Аниме-платформа", description: "Быстрая платформа для поиска аниме на Next.js и отдельном Express API.", longDescription: "Полный продукт для поиска аниме с адаптивным каталогом, отдельным Express backend и продуманными состояниями загрузки.", category: "Full-Stack" },
  },
  "28-maktab_xonqa": {
    uz: { name: "Maktab platformasi — 28-maktab Xonqa", description: "Yangiliklar, statistika va bitiruvchilar ma'lumotlari uchun himoyalangan admin panelga ega maktab platformasi.", longDescription: "Maktabning kundalik ehtiyojlari uchun e'lonlar, axborot markazi, statistika va kontentni kodsiz boshqarish paneli.", category: "Full-Stack" },
    ru: { name: "Школьная платформа — школа №28 Хонка", description: "Современная школьная платформа с новостями, статистикой и защищённой админ-панелью.", longDescription: "Платформа для объявлений, информационного центра, статистики и самостоятельного управления контентом сотрудниками школы.", category: "Full-Stack" },
  },
  xonatr: { uz: { name: "XonAtr", description: "Zustand, animatsiyalar va Tailwind CSS dizayn tizimiga ega Next.js ilovasi.", category: "Frontend" }, ru: { name: "XonAtr", description: "Приложение Next.js с Zustand, анимированными переходами и дизайн-системой Tailwind CSS.", category: "Frontend" } },
  onlayn_savdo: { uz: { name: "Onlayn savdo — E-Commerce", description: "Mahsulotlar, savat jarayoni va qayta ishlatiladigan komponentlarga ega zamonaviy internet-do'kon.", category: "Frontend" }, ru: { name: "Onlayn Savdo — интернет-магазин", description: "Интернет-магазин с каталогом товаров, корзиной и чистой архитектурой переиспользуемых компонентов.", category: "Frontend" } },
  "task-management": { uz: { name: "TaskFlow — Kanban va Crypto", description: "Next.js App Router asosidagi Kanban menejer va jonli kripto bozori ko'rinishi.", category: "Full-Stack" }, ru: { name: "TaskFlow — Kanban и Crypto", description: "Полноценный Kanban-менеджер на Next.js App Router с живым обзором крипторынка.", category: "Full-Stack" } },
  ob_xavo: { uz: { name: "Ob-havo — ob-havo ilovasi", description: "Responsive interfeys va Weather API bilan yaratilgan ob-havo ilovasi.", category: "Frontend" }, ru: { name: "Ob-Havo — приложение погоды", description: "Приложение погоды с адаптивным интерфейсом и интеграцией Weather API.", category: "Frontend" } },
  lugat: { uz: { name: "LexoraUz — lug'at ilovasi", description: "So'z boyligini oshirish uchun mobil lug'at ilovasi.", category: "Mobile" }, ru: { name: "LexoraUz — словарь", description: "Мобильное приложение-словарь для расширения словарного запаса.", category: "Mobile" } },
  "2d_o-yin_ish_uchun": { uz: { name: "Arkanoid — NES nashri", description: "Klassik Arkanoid o'yinining retro NES uslubidagi 2D talqini.", category: "Game" }, ru: { name: "Arkanoid — версия NES", description: "2D-версия классической игры Arkanoid в ретро-стиле NES.", category: "Game" } },
  react_new_app: { uz: { name: "React Scratch App", description: "React imkoniyatlarini sinash uchun yaratilgan kichik ilova.", category: "Mini App" }, ru: { name: "React Scratch App", description: "Небольшое приложение для экспериментов с возможностями React.", category: "Mini App" } },
  valyutalar_kanverdi: { uz: { name: "Valyuta kursi — konvertor", description: "Valyuta kurslarini ko'rsatadigan va hisoblaydigan mobil konvertor.", category: "Mobile" }, ru: { name: "Курс валют — конвертер", description: "Мобильный конвертер с актуальными курсами валют и расчётами.", category: "Mobile" } },
  portifolio: { uz: { name: "Neon portfolio", description: "Zamonaviy frontend ishlar va loyihalarni namoyish qiluvchi portfolio.", category: "Frontend" }, ru: { name: "Neon Portfolio", description: "Портфолио для презентации современных frontend-работ и проектов.", category: "Frontend" } },
  react_todos: { uz: { name: "React Todos", description: "Vazifalarni boshqarish uchun sodda va qulay React ilovasi.", category: "Mini App" }, ru: { name: "React Todos", description: "Простое и удобное React-приложение для управления задачами.", category: "Mini App" } },
  react_info_generator: { uz: { name: "React ma'lumot generatori", description: "React bilan turli ma'lumotlarni yaratish va ko'rsatish uchun mini ilova.", category: "Mini App" }, ru: { name: "React Info Generator", description: "Мини-приложение для создания и отображения информации на React.", category: "Mini App" } },
  react_savollar_javoblar: { uz: { name: "Quiz — savol va javoblar", description: "Savollar va javoblar asosidagi interaktiv quiz ilovasi.", category: "Mini App" }, ru: { name: "Quiz — вопросы и ответы", description: "Интерактивное приложение-викторина с вопросами и ответами.", category: "Mini App" } },
  timer: { uz: { name: "Countdown Timer — ortga sanagich", description: "Vaqtni kuzatish uchun sodda countdown timer ilovasi.", category: "Mini App" }, ru: { name: "Countdown Timer — таймер", description: "Простое приложение с обратным отсчётом времени.", category: "Mini App" } },
  "javascript-qalqulyatr": { uz: { name: "JavaScript kalkulyator", description: "JavaScript yordamida yaratilgan qulay kalkulyator ilovasi.", category: "Mini App" }, ru: { name: "JavaScript-калькулятор", description: "Удобное приложение-калькулятор, созданное на JavaScript.", category: "Mini App" } },
};

export function localizeProfile(profile: Profile, locale: Locale): Profile {
  const localized = { ...profile, ...(profileCopy[locale] ?? {}) };
  const categoryNames: Record<string, string> = locale === "uz"
    ? { Core: "Asosiy", Framework: "Framework", Styling: "Stilizatsiya", Tooling: "Vositalar", Tools: "Asboblar" }
    : locale === "ru"
      ? { Core: "Основы", Framework: "Фреймворки", Styling: "Стилизация", Tooling: "Инструменты", Tools: "Инструменты" }
      : {};
  return {
    ...localized,
    skills: profile.skills.map((skill) => ({ ...skill, category: categoryNames[skill.category] ?? skill.category })),
  };
}

export function localizeProjects(projects: Project[], locale: Locale): Project[] {
  return projects.map((project) => ({ ...project, ...(projectCopy[project.slug]?.[locale] ?? {}) }));
}