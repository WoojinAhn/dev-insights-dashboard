'use client';

import { useState, useEffect } from 'react';
import { 
  Github, 
  Star, 
  GitFork, 
  Code2, 
  ExternalLink, 
  MapPin, 
  Link as LinkIcon, 
  Cpu, 
  Layers, 
  Workflow,
  Languages,
  Pin
} from 'lucide-react';
import { translations, Lang } from '@/lib/translations';

const LANGUAGE_COLORS: Record<string, string> = {
  Java: 'bg-orange-600',
  Python: 'bg-blue-500',
  TypeScript: 'bg-cyan-400',
  JavaScript: 'bg-yellow-400',
  Shell: 'bg-green-500',
  HTML: 'bg-orange-400',
  CSS: 'bg-violet-500',
  C: 'bg-slate-500',
  'C++': 'bg-pink-500',
  Rust: 'bg-red-500',
};

const getLanguageColor = (lang: string) => LANGUAGE_COLORS[lang] || 'bg-slate-400';

export default function Dashboard() {
  const [lang, setLang] = useState<Lang>('ko');
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const t = translations[lang];

  useEffect(() => {
    async function fetchData() {
      const [userRes, reposRes, analysisRes, pinnedRes] = await Promise.all([
        fetch('/data/user.json'),
        fetch('/data/repos.json'),
        fetch('/data/analysis.json'),
        fetch('/data/pinned.json').catch(() => null)
      ]);
      
      const user = await userRes.json();
      const allRepos = await reposRes.json();
      const analysis = await analysisRes.json();
      const pinnedRepos = pinnedRes ? await pinnedRes.json() : [];
      
      // Strictly Filter Public Only
      const publicRepos = allRepos.filter((r: any) => !r.isPrivate);
      const publicPinned = pinnedRepos.filter((r: any) => !r.isPrivate);
      
      const totalStars = publicRepos.reduce((acc: number, repo: any) => acc + (repo.stargazerCount || 0), 0);
      const totalForks = publicRepos.reduce((acc: number, repo: any) => acc + (repo.forkCount || 0), 0);
      
      const languageCounts: Record<string, number> = {};
      publicRepos.forEach((repo: any) => {
        if (repo.primaryLanguage) {
          const l = repo.primaryLanguage.name;
          languageCounts[l] = (languageCounts[l] || 0) + 1;
        }
      });

      const languages = Object.entries(languageCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Featured Logic: Pinned first, then top public (by stars, then date)
      const pinnedNames = new Set(publicPinned.map((p: any) => p.name));
      const secondaryRepos = publicRepos
        .filter((r: any) => !pinnedNames.has(r.name))
        .sort((a: any, b: any) => {
          if (b.stargazerCount !== a.stargazerCount) return (b.stargazerCount || 0) - (a.stargazerCount || 0);
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        });

      const featured = [...publicPinned, ...secondaryRepos].slice(0, 9);

      setData({
        user,
        repos: publicRepos,
        analysis,
        pinned: publicPinned,
        featured,
        stats: { totalStars, totalForks, languages }
      });
      setIsLoading(false);
    }
    fetchData();
  }, []);

  if (isLoading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-cyan-400">
      <Cpu className="w-12 h-12 animate-pulse" />
    </div>
  );

  const { user, analysis, stats, featured, pinned } = data;
  const currentAnalysis = lang === 'ko' ? analysis.ko : analysis.en;
  const pinnedNames = new Set(pinned.map((p: any) => p.name));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      {/* Glow Effect */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-500/10 blur-[120px] pointer-events-none" />

      {/* Language Toggle */}
      <button 
        onClick={() => setLang(lang === 'ko' ? 'en' : 'ko')}
        className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-full hover:border-cyan-500/50 hover:bg-slate-800 transition-all text-sm font-bold shadow-2xl"
      >
        <Languages className="w-4 h-4 text-cyan-400" />
        {t.langButton}
      </button>

      <main className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        
        {/* Header */}
        <section className="mb-16 flex flex-col md:flex-row gap-8 items-start">
          <div className="relative group mx-auto md:mx-0">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <img 
              src={user.avatar_url} 
              alt={user.name} 
              className="relative w-32 h-32 rounded-2xl border border-white/10 object-cover shadow-2xl"
            />
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent uppercase">
              {user.name || user.login}{t.headerTitle}
            </h1>
            <p className="text-slate-400 text-lg mb-4 max-w-2xl mx-auto md:mx-0 font-light">{user.bio}</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors">
                <Github className="w-4 h-4" />
                <a href={user.html_url} target="_blank" rel="noreferrer">@{user.login}</a>
              </div>
              {user.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {user.location}
                </div>
              )}
              {user.blog && (
                <div className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors">
                  <LinkIcon className="w-4 h-4" />
                  <a href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`} target="_blank" rel="noreferrer">
                    {user.blog}
                  </a>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
          {[
            { label: t.repositories, value: user.public_repos, icon: Layers, color: 'text-blue-400' },
            { label: t.totalStars, value: stats.totalStars, icon: Star, color: 'text-yellow-400' },
            { label: t.forksEarned, value: stats.totalForks, icon: GitFork, color: 'text-purple-400' },
            { label: t.topLang, value: stats.languages[0]?.name || 'N/A', icon: Code2, color: 'text-cyan-400' },
          ].map((stat, i) => (
            <div key={i} className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-4 md:p-6 rounded-2xl hover:border-slate-700 transition-all group">
              <div className="flex items-center justify-between mb-2">
                <p className="text-slate-500 text-[10px] md:text-xs font-bold uppercase tracking-widest">{stat.label}</p>
                <stat.icon className={`w-4 h-4 md:w-5 md:h-5 ${stat.color} group-hover:scale-110 transition-transform`} />
              </div>
              <p className="text-xl md:text-3xl font-bold font-mono tracking-tight">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* AI Analysis */}
        <section className="mb-12">
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-cyan-500/20 rounded-3xl p-6 md:p-10 relative overflow-hidden group shadow-[0_0_50px_-20px_rgba(34,211,238,0.2)]">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Cpu className="w-32 h-32 text-cyan-500" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Workflow className="w-5 h-5 text-cyan-400" />
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-cyan-400">{t.aiAnalysis}</h2>
              </div>
              <p className="text-lg md:text-2xl text-slate-300 leading-relaxed mb-8 max-w-5xl font-light italic">
                &quot;{currentAnalysis.summary}&quot;
              </p>
              
              <div className="flex flex-wrap gap-2 md:gap-3">
                {currentAnalysis.strengths.map((strength: string, i: number) => (
                  <span key={i} className="px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] md:text-xs font-bold uppercase tracking-wider">
                    {strength}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Languages */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2 uppercase tracking-tight">
              <Code2 className="w-5 h-5 text-violet-400" />
              {t.primaryStack}
            </h2>
          </div>
          
          <div className="bg-slate-900/40 rounded-2xl p-6 md:p-8 border border-slate-800 backdrop-blur-sm">
            <div className="flex h-4 w-full rounded-full overflow-hidden mb-8 bg-slate-800 shadow-inner">
              {stats.languages.map((lang: any, i: number) => (
                <div 
                  key={i} 
                  className={`${getLanguageColor(lang.name)} transition-all hover:opacity-80`} 
                  style={{ width: `${(lang.count / stats.languages.reduce((a: any, b: any) => a + b.count, 0)) * 100}%` }}
                />
              ))}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {stats.languages.map((lang: any, i: number) => (
                <div key={i} className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getLanguageColor(lang.name)}`} />
                    <span className="text-sm font-bold text-slate-200">{lang.name}</span>
                  </div>
                  <span className="text-xs text-slate-500 font-mono pl-4">{lang.count} {t.repos}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Repositories */}
        <section>
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-xl font-bold flex items-center gap-2 uppercase tracking-tight">
              <Star className="w-5 h-5 text-yellow-400" />
              {t.featuredProjects}
            </h2>
            <a href={user.html_url + '?tab=repositories'} className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 uppercase tracking-widest border-b border-cyan-500/30">
              {t.viewAll} <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((repo: any, i: number) => (
              <a 
                key={i} 
                href={repo.url} 
                target="_blank" 
                rel="noreferrer"
                className="group relative bg-slate-900/50 border border-slate-800 p-8 rounded-3xl hover:border-cyan-500/40 hover:bg-slate-900/80 transition-all flex flex-col hover:shadow-2xl overflow-hidden"
              >
                {pinnedNames.has(repo.name) && (
                  <div className="absolute top-4 right-4 text-cyan-500/40 group-hover:text-cyan-500/80 transition-colors">
                    <Pin className="w-4 h-4" />
                  </div>
                )}
                
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-black text-lg group-hover:text-cyan-400 transition-colors truncate pr-8 uppercase tracking-tighter">
                    {repo.name}
                  </h3>
                </div>
                <p className="text-slate-400 text-sm line-clamp-2 mb-8 flex-1 font-light leading-relaxed">
                  {repo.description || t.noDescription}
                </p>
                
                <div className="flex items-center gap-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  {repo.primaryLanguage && (
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${getLanguageColor(repo.primaryLanguage.name)}`} />
                      {repo.primaryLanguage.name}
                    </div>
                  )}
                  {repo.stargazerCount > 0 && (
                    <div className="flex items-center gap-1 group-hover:text-yellow-400 transition-colors">
                      <Star className="w-3 h-3" />
                      {repo.stargazerCount}
                    </div>
                  )}
                  {repo.forkCount > 0 && (
                    <div className="flex items-center gap-1 group-hover:text-purple-400 transition-colors">
                      <GitFork className="w-3 h-3" />
                      {repo.forkCount}
                    </div>
                  )}
                </div>
              </a>
            ))}
          </div>
        </section>

        <footer className="mt-24 pt-8 border-t border-slate-900/50 text-center text-slate-700 text-[10px] uppercase tracking-[0.2em] font-medium">
          <p>© 2026 {t.craftedBy}</p>
        </footer>
      </main>
    </div>
  );
}
