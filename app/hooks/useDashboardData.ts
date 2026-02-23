import { useState, useEffect } from 'react';
import type {
  User,
  Repository,
  Analysis,
  ForkRepository,
  PinnedRepository,
  Meta,
  DashboardData,
  LanguageStat,
} from '@/lib/data';

export function useDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const ts = new Date().getTime();
        const [userRes, reposRes, analysisRes, pinnedRes, forksRes, metaRes] = await Promise.all([
          fetch(`/data/user.json?t=${ts}`),
          fetch(`/data/repos.json?t=${ts}`),
          fetch(`/data/analysis.json?t=${ts}`),
          fetch(`/data/pinned.json?t=${ts}`).catch(() => null),
          fetch(`/data/forks.json?t=${ts}`).catch(() => null),
          fetch(`/data/meta.json?t=${ts}`).catch(() => null),
        ]);

        const user: User = await userRes.json();
        const allRepos: Repository[] = await reposRes.json();
        const analysis: Analysis = await analysisRes.json();
        const pinnedRepos: PinnedRepository[] = pinnedRes ? await pinnedRes.json() : [];
        const meta: Meta | null = metaRes ? await metaRes.json().catch(() => null) : null;

        let topForks: ForkRepository[] = [];
        try {
          const allForks: ForkRepository[] = forksRes ? await forksRes.json() : [];
          topForks = allForks
            .filter((r) => !r.isPrivate)
            .sort(
              (a, b) =>
                (b.parent?.stargazerCount || b.stargazerCount || 0) -
                (a.parent?.stargazerCount || a.stargazerCount || 0),
            )
            .slice(0, 9);
        } catch (e) {
          console.error('Failed to process forks:', e);
        }

        const publicRepos = allRepos.filter((r) => !r.isPrivate);
        const publicPinned = pinnedRepos.filter((r) => !r.isPrivate);

        const totalStars = publicRepos.reduce((acc, repo) => acc + (repo.stargazerCount || 0), 0);
        const totalForks = publicRepos.reduce((acc, repo) => acc + (repo.forkCount || 0), 0);

        const languageCounts: Record<string, number> = {};
        publicRepos.forEach((repo) => {
          if (repo.primaryLanguage) {
            const l = repo.primaryLanguage.name;
            languageCounts[l] = (languageCounts[l] || 0) + 1;
          }
        });

        const languages: LanguageStat[] = Object.entries(languageCounts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        const pinnedNames = new Set(publicPinned.map((p) => p.name));
        const recommendedNames: string[] = analysis.recommended_featured || [];
        const recommendedRepos = publicRepos
          .filter((r) => !pinnedNames.has(r.name) && recommendedNames.includes(r.name))
          .sort((a, b) => recommendedNames.indexOf(a.name) - recommendedNames.indexOf(b.name));

        const otherRepos = publicRepos
          .filter((r) => !pinnedNames.has(r.name) && !recommendedNames.includes(r.name))
          .sort((a, b) => (b.stargazerCount || 0) - (a.stargazerCount || 0));

        const featured = [...publicPinned, ...recommendedRepos, ...otherRepos].slice(0, 9);

        setData({
          user,
          repos: publicRepos,
          analysis,
          pinned: publicPinned,
          featured,
          stats: { totalStars, totalForks, languages },
          forks: topForks,
          meta: meta ?? undefined,
        });
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  return { data, isLoading };
}
