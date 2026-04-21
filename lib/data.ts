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
  tag_en: string;
  tag_ko: string;
}

export interface AnalysisSection {
  summary: string;
  strengths: AnalysisStrength[];
  ai_summary: string;
}

export interface AiCapability {
  key: string;
  title_en: string;
  title_ko: string;
  score: number;
  desc_en: string;
  desc_ko: string;
}

export interface AnalysisInterestKeyword {
  name: string;
  desc_en: string;
  desc_ko: string;
}

export interface AnalysisInterests {
  title_en: string;
  title_ko: string;
  keywords: AnalysisInterestKeyword[];
  desc_en: string;
  desc_ko: string;
}

export interface RecommendedFeatured {
  name: string;
  reason_en: string;
  reason_ko: string;
}

export interface Analysis {
  en: AnalysisSection;
  ko: AnalysisSection;
  top_technologies: string[];
  recommended_featured: (string | RecommendedFeatured)[];
  ai_capabilities: AiCapability[];
  interests: AnalysisInterests;
  model_provider?: string;
}

export interface Meta {
  last_updated: string;
}

export interface StatsHistoryEntry {
  date: string;
  totalStars: number;
  totalForks: number;
  repoCount: number;
  followers: number;
}

export interface StatsDeltas {
  totalStars: number | null;
  totalForks: number | null;
  repoCount: number | null;
  followers: number | null;
}

export interface LanguageStat {
  name: string;
  bytes: number;
  repoCount: number;
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
  aiSignals: Record<string, string[]>;
  statsDeltas: StatsDeltas;
  aiPickReasons: Record<string, { reason_en: string; reason_ko: string }>;
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

  const languageTotals: Record<string, { bytes: number; repoCount: number }> = {};
  repos.forEach((repo) => {
    repo.languages?.forEach(({ size, node }) => {
      const entry = languageTotals[node.name] ?? { bytes: 0, repoCount: 0 };
      entry.bytes += size;
      entry.repoCount += 1;
      languageTotals[node.name] = entry;
    });
  });

  const languages: LanguageStat[] = Object.entries(languageTotals)
    .map(([name, { bytes, repoCount }]) => ({ name, bytes, repoCount }))
    .sort((a, b) => b.bytes - a.bytes)
    .slice(0, 8);

  return { totalStars, totalForks, languages };
}

function computeDeltas(
  history: StatsHistoryEntry[],
  current: { totalStars: number; totalForks: number; repoCount: number; followers: number },
): StatsDeltas {
  if (!history || history.length < 1) {
    return { totalStars: null, totalForks: null, repoCount: null, followers: null };
  }
  const today = new Date().toISOString().slice(0, 10);
  const lastEntry = history[history.length - 1];
  const baseEntry = lastEntry.date === today ? history[history.length - 2] : lastEntry;
  if (!baseEntry) {
    return { totalStars: null, totalForks: null, repoCount: null, followers: null };
  }
  return {
    totalStars: current.totalStars - baseEntry.totalStars,
    totalForks: current.totalForks - baseEntry.totalForks,
    repoCount:  current.repoCount  - baseEntry.repoCount,
    followers:  current.followers  - baseEntry.followers,
  };
}

export function getDashboardData(): DashboardData {
  const user = readJson<User>('user.json')!;
  const allRepos = readJson<Repository[]>('repos.json') ?? [];
  const analysis = readJson<Analysis>('analysis.json')!;
  const pinnedRepos = readJson<PinnedRepository[]>('pinned.json') ?? [];
  const allForks = readJson<ForkRepository[]>('forks.json') ?? [];
  const meta = readJson<Meta>('meta.json') ?? undefined;
  const aiSignals = readJson<Record<string, string[]>>('ai-signals.json') ?? {};
  const statsHistory = readJson<StatsHistoryEntry[]>('stats-history.json') ?? [];

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
  const statsDeltas = computeDeltas(statsHistory, {
    totalStars: stats.totalStars,
    totalForks: stats.totalForks,
    repoCount: publicRepos.length,
    followers: user.followers,
  });

  // Featured: pinned first, then AI-recommended, then by stars
  const pinnedNames = new Set(publicPinned.map((p) => p.name));
  const rawFeatured = analysis.recommended_featured || [];
  const recommendedNames: string[] = rawFeatured.map((item) =>
    typeof item === 'string' ? item : item.name,
  );
  const aiPickReasons: Record<string, { reason_en: string; reason_ko: string }> = {};
  for (const item of rawFeatured) {
    if (typeof item !== 'string' && item.reason_en && item.reason_ko) {
      aiPickReasons[item.name] = { reason_en: item.reason_en, reason_ko: item.reason_ko };
    }
  }
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
    aiSignals,
    statsDeltas,
    aiPickReasons,
  };
}
