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

export async function getUser(): Promise<User> {
  const filePath = path.join(process.cwd(), 'public/data/user.json');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(fileContent);
}

export async function getRepos(): Promise<Repository[]> {
  const filePath = path.join(process.cwd(), 'public/data/repos.json');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(fileContent);
}

export async function getAnalysis(): Promise<Analysis> {
  const filePath = path.join(process.cwd(), 'public/data/analysis.json');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(fileContent);
}

export async function getStats() {
  const repos = await getRepos();
  
  const totalStars = repos.reduce((acc, repo) => acc + repo.stargazerCount, 0);
  const totalForks = repos.reduce((acc, repo) => acc + repo.forkCount, 0);
  
  // Calculate language distribution
  const languageCounts: Record<string, number> = {};
  
  repos.forEach(repo => {
    if (repo.primaryLanguage) {
      const lang = repo.primaryLanguage.name;
      languageCounts[lang] = (languageCounts[lang] || 0) + 1;
    }
  });

  const languages = Object.entries(languageCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Top 5

  return {
    totalStars,
    totalForks,
    languages
  };
}
