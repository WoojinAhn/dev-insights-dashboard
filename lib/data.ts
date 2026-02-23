import fs from 'fs';
import path from 'path';

export interface Repository {
  name: string;
  description: string;
  stargazerCount: number;
  languages: { size: number; node: { name: string } }[];
  url: string;
  updatedAt: string;
  isPrivate: boolean;
  primaryLanguage: { name: string } | null;
  forkCount: number;
}

export interface User {
  login: string;
  avatar_url: string;
  html_url: string;
  name: string;
  company: string | null;
  blog: string;
  location: string | null;
  email: string | null;
  bio: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface AnalysisStrength {
  strength: string;
  evidence: string;
}

export interface AnalysisSection {
  summary: string;
  strengths: AnalysisStrength[];
  ai_summary: string;
}

export interface AiCapability {
  key: string;
  score: number;
  desc_en: string;
  desc_ko: string;
}

export interface AnalysisInterests {
  title: string;
  keywords: string[];
  desc_en: string;
  desc_ko: string;
}

export interface Analysis {
  en: AnalysisSection;
  ko: AnalysisSection;
  top_technologies: string[];
  recommended_featured: string[];
  ai_capabilities: AiCapability[];
  interests: AnalysisInterests;
  model_provider?: string;
}

export interface Meta {
  last_updated: string;
}

export interface LanguageStat {
  name: string;
  count: number;
}

export interface DashboardStats {
  totalStars: number;
  totalForks: number;
  languages: LanguageStat[];
}

export interface DashboardData {
  user: User;
  repos: Repository[];
  analysis: Analysis;
  pinned: PinnedRepository[];
  featured: (Repository | PinnedRepository)[];
  stats: DashboardStats;
  forks: ForkRepository[];
  meta?: Meta;
}

export interface ForkParent {
  name: string;
  owner: {
    login: string;
  };
  stargazerCount: number;
  forkCount: number;
}

export interface ForkRepository {
  name: string;
  description: string | null;
  url: string;
  isPrivate: boolean;
  isFork: boolean;
  updatedAt: string;
  stargazerCount: number;
  forkCount: number;
  primaryLanguage: { name: string } | null;
  parent: ForkParent;
}

export interface PinnedRepository {
  name: string;
  description: string | null;
  stargazerCount: number;
  forkCount: number;
  url: string;
  isPrivate: boolean;
  isFork: boolean;
  primaryLanguage: { name: string } | null;
  updatedAt: string;
}

function readJson<T>(fileName: string): T | null {
  try {
    const filePath = path.join(process.cwd(), 'public/data', fileName);
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return null;
  }
}

function computeStats(repos: Repository[]): DashboardStats {
  const totalStars = repos.reduce((acc, repo) => acc + (repo.stargazerCount || 0), 0);
  const totalForks = repos.reduce((acc, repo) => acc + (repo.forkCount || 0), 0);

  const languageCounts: Record<string, number> = {};
  repos.forEach((repo) => {
    if (repo.primaryLanguage) {
      const l = repo.primaryLanguage.name;
      languageCounts[l] = (languageCounts[l] || 0) + 1;
    }
  });

  const languages: LanguageStat[] = Object.entries(languageCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return { totalStars, totalForks, languages };
}

export function getDashboardData(): DashboardData {
  const user = readJson<User>('user.json')!;
  const allRepos = readJson<Repository[]>('repos.json') ?? [];
  const analysis = readJson<Analysis>('analysis.json')!;
  const pinnedRepos = readJson<PinnedRepository[]>('pinned.json') ?? [];
  const allForks = readJson<ForkRepository[]>('forks.json') ?? [];
  const meta = readJson<Meta>('meta.json') ?? undefined;

  const publicRepos = allRepos.filter((r) => !r.isPrivate);
  const publicPinned = pinnedRepos.filter((r) => !r.isPrivate);

  const topForks = allForks
    .filter((r) => !r.isPrivate)
    .sort(
      (a, b) =>
        (b.parent?.stargazerCount || b.stargazerCount || 0) -
        (a.parent?.stargazerCount || a.stargazerCount || 0),
    )
    .slice(0, 9);

  const stats = computeStats(publicRepos);

  // Featured: pinned first, then AI-recommended, then by stars
  const pinnedNames = new Set(publicPinned.map((p) => p.name));
  const recommendedNames: string[] = analysis.recommended_featured || [];
  const recommendedRepos = publicRepos
    .filter((r) => !pinnedNames.has(r.name) && recommendedNames.includes(r.name))
    .sort((a, b) => recommendedNames.indexOf(a.name) - recommendedNames.indexOf(b.name));
  const otherRepos = publicRepos
    .filter((r) => !pinnedNames.has(r.name) && !recommendedNames.includes(r.name))
    .sort((a, b) => (b.stargazerCount || 0) - (a.stargazerCount || 0));
  const featured = [...publicPinned, ...recommendedRepos, ...otherRepos].slice(0, 9);

  return {
    user,
    repos: publicRepos,
    analysis,
    pinned: publicPinned,
    featured,
    stats,
    forks: topForks,
    meta,
  };
}
