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

export interface Analysis {
  summary: string;
  strengths: string[];
  top_technologies: string[];
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
