export type Project = {
  id: string;
  slug: string;
  name: string;
  description: string;
  longDescription?: string;
  repoUrl: string;
  /** Empty string means "this project has no public deployment". */
  liveUrl: string;
  language: string;
  category: string;
  tech: string[];
  topics: string[];
  stars: number;
  forks: number;
  createdAt: string;
  updatedAt: string;
  /** Optional screenshot URL shown on the card instead of the generated cover. */
  image: string;
  featured: boolean;
  /** Unchecked to hide a project from the public site without deleting it. */
  visible: boolean;
  order: number;
};

export type Skill = {
  name: string;
  category: string;
  level?: number;
};

export type ExperienceItem = {
  role: string;
  company: string;
  period: string;
  location?: string;
  highlights?: string[];
};

export type EducationItem = {
  degree: string;
  school: string;
  period: string;
  location?: string;
};

export type ProfileStats = {
  followers?: number;
  following?: number;
  publicRepos?: number;
  stars?: number;
  liveDemos?: number;
  languages?: { name: string; count: number }[];
};

export type Profile = {
  name: string;
  username: string;
  headline: string;
  roles: string[];
  bio: string[];
  location: string;
  company: string;
  avatarUrl: string;
  github: string;
  blog: string;
  email: string;
  telegram: string;
  linkedin: string;
  twitter: string;
  resumeUrl: string;
  quote: string;
  quoteTranslation: string;
  interests: string[];
  stats: ProfileStats;
  skills: Skill[];
  experience: ExperienceItem[];
  education: EducationItem[];
  updatedAt: string;
};

/** Where the admin panel persisted a change. */
export type SaveMode = "github" | "filesystem";

/** Shape the admin dashboard posts to /api/projects. */
export type ProjectInput = Partial<Omit<Project, "id" | "slug">> & {
  name: string;
};
