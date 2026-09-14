export const LOCALES = ["uz", "en", "ru"] as const;
export type Locale = (typeof LOCALES)[number];

export function isLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}

export type Dictionary = {
  languageName: string;
  nav: { home: string; github: string; viewGithub: string; open: string; close: string; aria: string };
  sections: { home: string; about: string; skills: string; projects: string; contact: string };
  hero: {
    available: string; projects: string; deployments: string; stars: string; technologies: string;
    viewWork: string; telegram: string; resume: string; followers: string; following: string;
  };
  about: { eyebrow: string; title: string; description: string; experience: string; education: string; details: string; stars: string; repos: string };
  skills: { eyebrow: string; title: string; description: string; languageMix: string; repos: string; repo: string };
  projects: { eyebrow: string; title: string; description: string; search: string; results: string; result: string; all: string; clear: string; noProjects: string; tryAgain: string; reset: string; showAll: string; featured: string; noDescription: string; live: string; source: string; demo: string };
  contact: { eyebrow: string; title: string; description: string; fastest: string; work: string; professional: string; source: string; available: string; looking: string; remote: string; telegram: string; browse: string };
  footer: { sections: string; elsewhere: string; rights: string; built: string; cta: string; ctaLink: string };
};

const dictionaries: Record<Locale, Dictionary> = {
  uz: {
    languageName: "O'zbekcha",
    nav: { home: "Bosh sahifa", github: "GitHub", viewGithub: "GitHubni ko'rish", open: "Menyuni ochish", close: "Menyuni yopish", aria: "Asosiy navigatsiya" },
    sections: { home: "Bosh sahifa", about: "Men haqimda", skills: "Ko'nikmalar", projects: "Loyihalar", contact: "Aloqa" },
    hero: { available: "Frontend imkoniyatlariga ochiqman", projects: "Loyihalar", deployments: "Jonli loyihalar", stars: "GitHub yulduzlari", technologies: "Texnologiyalar", viewWork: "Ishlarimni ko'rish", telegram: "Telegram", resume: "Rezyume", followers: "kuzatuvchi", following: "kuzatilgan" },
    about: { eyebrow: "Men haqimda", title: "G'oyani tayyor mahsulotga aylantiraman", description: "Nimalar bilan ishlashim, qanday ishlashim va kodda nimalarga e'tibor berishim haqida qisqacha.", experience: "Tajriba", education: "Ta'lim", details: "Tafsilotlar", stars: "yulduz", repos: "ochiq repo" },
    skills: { eyebrow: "Ko'nikmalar", title: "Ishonch bilan foydalanadigan stekim", description: "Har kuni foydalanadigan vositalarim, intervyuda himoya qila oladigan tartibda.", languageMix: "Repozitoriyalardagi tillar", repos: "ochiq repo", repo: "repo" },
    projects: { eyebrow: "Loyihalar", title: "Loyihalagan, yaratgan va ishga tushirganlarim", description: "Nomimni mamnuniyat bilan qo'yadigan ochiq loyihalarim — ulardan bir qismi hozir jonli.", search: "Loyihalar, texnologiya yoki kalit so'z qidiring…", results: "natija", result: "natija", all: "Barchasi", clear: "Qidiruvni tozalash", noProjects: "Loyiha topilmadi", tryAgain: "Boshqa kalit so'zni sinang yoki filtrlarni tozalang.", reset: "Filtrlarni tiklash", showAll: "Barcha loyihalarni ko'rsatish", featured: "tanlangan", noDescription: "Tavsif hali yo'q.", live: "Jonli", source: "GitHub manba kodi", demo: "jonli demo" },
    contact: { eyebrow: "Aloqa", title: "Birgalikda nimadir yaratamiz", description: "Frontend ishlar, freelance loyihalar va hamkorliklarga ochiqman. O'zingizga qulay kanalni tanlang.", fastest: "Eng tez javob", work: "Ish takliflari uchun", professional: "Professional profil", source: "Barcha manba kodlari", available: "Hozir mavjudman", looking: "Ishni oxirigacha yetkazadigan frontend dasturchi izlayapsizmi?", remote: "Men {location}da joylashganman va istalgan vaqt zonasidagi jamoalar bilan masofadan ishlay olaman.", telegram: "Telegram orqali yozish", browse: "Kodlarni ko'rish" },
    footer: { sections: "Bo'limlar", elsewhere: "Ijtimoiy tarmoqlar", rights: "Barcha huquqlar himoyalangan.", built: "Next.js, TypeScript va Tailwind CSS bilan yaratildi", cta: "Sizga ham shunday zamonaviy web-sayt kerakmi?", ctaLink: "Telegram orqali murojaat qiling." },
  },
  en: {
    languageName: "English",
    nav: { home: "Home", github: "GitHub", viewGithub: "View GitHub", open: "Open menu", close: "Close menu", aria: "Main navigation" },
    sections: { home: "Home", about: "About", skills: "Skills", projects: "Projects", contact: "Contact" },
    hero: { available: "Open to frontend opportunities", projects: "Projects built", deployments: "Live deployments", stars: "GitHub stars", technologies: "Technologies", viewWork: "View my work", telegram: "Telegram", resume: "Resume", followers: "followers", following: "following" },
    about: { eyebrow: "About me", title: "Turning designs into shipped products", description: "A short version of what I work with, how I work, and what I care about in a codebase.", experience: "Experience", education: "Education", details: "Details", stars: "stars across", repos: "public repos" },
    skills: { eyebrow: "Skills", title: "The stack I reach for", description: "Tools I use day to day, roughly in the order I'd defend them in an interview.", languageMix: "Language mix across repositories", repos: "public repos", repo: "repo" },
    projects: { eyebrow: "Projects", title: "Things I've designed, built and shipped", description: "Every public repository I'm happy to put my name on — some of them are deployed and clickable right now.", search: "Search projects, tech or keywords…", results: "results", result: "result", all: "All", clear: "Clear search", noProjects: "No projects found", tryAgain: "Try a different keyword or clear the filters.", reset: "Reset filters", showAll: "Show all projects", featured: "featured", noDescription: "No description yet.", live: "Live", source: "source code on GitHub", demo: "live demo" },
    contact: { eyebrow: "Contact", title: "Let's build something together", description: "I'm open to frontend roles, freelance projects and collaborations. Pick whichever channel suits you.", fastest: "Fastest reply", work: "For work enquiries", professional: "Professional profile", source: "All source code", available: "Currently available", looking: "Looking for a frontend developer who ships?", remote: "I'm based in {location} and comfortable working remotely with teams in any timezone.", telegram: "Message me on Telegram", browse: "Browse the code" },
    footer: { sections: "Sections", elsewhere: "Elsewhere", rights: "All rights reserved.", built: "Built with Next.js, TypeScript & Tailwind CSS", cta: "Need a modern website like this one?", ctaLink: "Contact me on Telegram." },
  },
  ru: {
    languageName: "Русский",
    nav: { home: "Главная", github: "GitHub", viewGithub: "Открыть GitHub", open: "Открыть меню", close: "Закрыть меню", aria: "Основная навигация" },
    sections: { home: "Главная", about: "Обо мне", skills: "Навыки", projects: "Проекты", contact: "Контакты" },
    hero: { available: "Открыт к frontend-возможностям", projects: "Проекты", deployments: "Запущенные проекты", stars: "Звёзды GitHub", technologies: "Технологии", viewWork: "Смотреть работы", telegram: "Telegram", resume: "Резюме", followers: "подписчиков", following: "подписок" },
    about: { eyebrow: "Обо мне", title: "Превращаю дизайн в готовый продукт", description: "Кратко о том, с чем я работаю, как строю процесс и что ценю в коде.", experience: "Опыт", education: "Образование", details: "Детали", stars: "звёзд в", repos: "открытых репозиториях" },
    skills: { eyebrow: "Навыки", title: "Мой рабочий стек", description: "Инструменты, которыми я пользуюсь каждый день и готов защищать на собеседовании.", languageMix: "Языки в репозиториях", repos: "открытых репозиториев", repo: "репозиторий" },
    projects: { eyebrow: "Проекты", title: "Проекты, которые я придумал и запустил", description: "Открытые репозитории, которыми я рад поделиться — некоторые уже доступны онлайн.", search: "Поиск проектов, технологий или ключевых слов…", results: "результатов", result: "результат", all: "Все", clear: "Очистить поиск", noProjects: "Проекты не найдены", tryAgain: "Попробуйте другой запрос или очистите фильтры.", reset: "Сбросить фильтры", showAll: "Показать все проекты", featured: "избранное", noDescription: "Описания пока нет.", live: "Открыть", source: "исходный код на GitHub", demo: "демо" },
    contact: { eyebrow: "Контакты", title: "Создадим что-нибудь вместе", description: "Открыт к frontend-работе, freelance-проектам и сотрудничеству. Выберите удобный канал.", fastest: "Самый быстрый ответ", work: "Для рабочих предложений", professional: "Профессиональный профиль", source: "Весь исходный код", available: "Доступен для работы", looking: "Ищете frontend-разработчика, который доводит дело до конца?", remote: "Я нахожусь в {location} и могу удалённо работать с командами в любом часовом поясе.", telegram: "Написать в Telegram", browse: "Открыть код" },
    footer: { sections: "Разделы", elsewhere: "Социальные сети", rights: "Все права защищены.", built: "Создано с Next.js, TypeScript и Tailwind CSS", cta: "Нужен современный сайт, как этот?", ctaLink: "Напишите мне в Telegram." },
  },
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}