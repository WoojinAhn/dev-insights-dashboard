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
  Pin,
  ChevronRight,
  Bot,
  Zap,
  Globe,
  Heart,
  Brain,
  Target,
  Telescope
} from 'lucide-react';

const STRENGTH_ICONS: any = {
  0: Bot,
  1: Zap,
  2: Globe,
  3: Heart
};

const CAP_ICONS: any = {
  Integration: Code2,
  Automation: Zap,
  Context: Target,
  Agentic: Bot
};
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
  const [scrolled, setScrolled] = useState(false);

  const t = translations[lang];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

    async function fetchData() {
      const ts = new Date().getTime();
      const [userRes, reposRes, analysisRes, pinnedRes, forksRes] = await Promise.all([
        fetch(`/data/user.json?t=${ts}`),
        fetch(`/data/repos.json?t=${ts}`),
        fetch(`/data/analysis.json?t=${ts}`),
        fetch(`/data/pinned.json?t=${ts}`).catch(() => null),
        fetch(`/data/forks.json?t=${ts}`).catch(() => null)
      ]);

      const user = await userRes.json();
      const allRepos = await reposRes.json();
      const analysis = await analysisRes.json();
      const pinnedRepos = pinnedRes ? await pinnedRes.json() : [];
      const allForks = forksRes ? await forksRes.json() : [];

      const publicRepos = allRepos.filter((r: any) => !r.isPrivate);
      const publicPinned = pinnedRepos.filter((r: any) => !r.isPrivate);
      
      // Process Forks: Public only, Sort by Stars DESC, Top 9
      const topForks = allForks
        .filter((r: any) => !r.isPrivate)
        .sort((a: any, b: any) => (b.stargazerCount || 0) - (a.stargazerCount || 0))
        .slice(0, 9);

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

      const pinnedNames = new Set(publicPinned.map((p: any) => p.name));
      // Featured Logic: 1. Pinned first, 2. AI Recommended, 3. Top Public
      const recommendedNames = analysis.recommended_featured || [];
      const recommendedRepos = publicRepos
        .filter((r: any) => !pinnedNames.has(r.name) && recommendedNames.includes(r.name))
        .sort((a: any, b: any) => recommendedNames.indexOf(a.name) - recommendedNames.indexOf(b.name));

      const otherRepos = publicRepos
        .filter((r: any) => !pinnedNames.has(r.name) && !recommendedNames.includes(r.name))
        .sort((a: any, b: any) => (b.stargazerCount || 0) - (a.stargazerCount || 0));

      const featured = [...publicPinned, ...recommendedRepos, ...otherRepos].slice(0, 9);

      setData({
        user,
        repos: publicRepos,
        analysis,
        pinned: publicPinned,
        featured,
        stats: { totalStars, totalForks, languages },
        forks: topForks
      });
      setIsLoading(false);
    }
    fetchData();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-cyan-400">
      <div className="relative">
        <div className="absolute inset-0 bg-cyan-400/20 blur-xl animate-pulse rounded-full" />
        <Cpu className="w-12 h-12 relative animate-[spin_3s_linear_infinite]" />
      </div>
    </div>
  );

  const { user, analysis, stats, featured, pinned, forks } = data;
  const currentAnalysis = lang === 'ko' ? analysis.ko : analysis.en;
  const pinnedNames = new Set(pinned.map((p: any) => p.name));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/10 blur-[120px] pointer-events-none animate-pulse" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-500/10 blur-[120px] pointer-events-none animate-pulse" />

      {/* Modern Navigation Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-4 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 shadow-2xl' : 'py-8'}`}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-500 p-[1px]">
              <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center">
                <Github className="w-5 h-5 text-white" />
              </div>
            </div>
            <span className="font-black text-xl tracking-tighter hidden sm:block">DEV.<span className="text-cyan-400">INSIGHTS</span></span>
          </div>

          <div className="flex items-center gap-2 p-1 bg-slate-900/50 rounded-full border border-white/5 backdrop-blur-md">
            <button
              onClick={() => setLang('ko')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${lang === 'ko' ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(34,211,238,0.4)]' : 'text-slate-400 hover:text-white'}`}
            >
              KOR
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${lang === 'en' ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(34,211,238,0.4)]' : 'text-slate-400 hover:text-white'}`}
            >
              ENG
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-32 pb-12 relative z-10">

        {/* Header / Profile */}
        <section className="mb-20 flex flex-col md:flex-row gap-10 items-center md:items-start text-center md:text-left">
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative p-1 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-3xl">
              <img
                src={user.avatar_url}
                alt={user.name}
                className="w-40 h-40 rounded-2xl object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500 shadow-2xl"
              />
            </div>
          </div>

          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase tracking-widest mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              Active Developer
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4 bg-gradient-to-r from-white via-white to-slate-500 bg-clip-text text-transparent uppercase">
              {user.name || user.login}{t.headerTitle}
            </h1>
            <p className="text-slate-400 text-xl mb-6 max-w-2xl font-light leading-relaxed italic">&quot;{user.bio}&quot;</p>

            <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm">
              <a href={user.html_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-slate-500 hover:text-cyan-400 transition-colors font-medium">
                <Github className="w-5 h-5" /> @{user.login}
              </a>
              {user.location && (
                <div className="flex items-center gap-2 text-slate-500">
                  <MapPin className="w-5 h-5" /> {user.location}
                </div>
              )}
              {user.blog && (
                <a href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-slate-500 hover:text-cyan-400 transition-colors">
                  <LinkIcon className="w-5 h-5" /> {user.blog.replace(/https?:\/\//, '')}
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-20">
          {[
            { label: t.repositories, value: user.public_repos, icon: Layers, color: 'from-blue-500 to-cyan-500' },
            { label: t.totalStars, value: stats.totalStars, icon: Star, color: 'from-yellow-500 to-orange-500' },
            { label: t.forksEarned, value: stats.totalForks, icon: GitFork, color: 'from-purple-500 to-pink-500' },
            { label: t.topLang, value: stats.languages[0]?.name || 'N/A', icon: Code2, color: 'from-cyan-500 to-blue-500' },
          ].map((stat, i) => (
            <div key={i} className="relative group overflow-hidden">
              <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-6 md:p-8 rounded-[2rem] hover:border-white/10 transition-all duration-500 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</p>
                  <div className={`p-2 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-10`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <p className="text-3xl md:text-4xl font-black font-mono tracking-tighter group-hover:scale-105 transition-transform origin-left duration-500">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* AI Analysis */}
        <section className="mb-20">
          <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-white/5 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden group shadow-2xl">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-500/10 blur-[80px] group-hover:bg-cyan-500/20 transition-all duration-1000" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                  <Workflow className="w-6 h-6 text-cyan-400" />
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tight text-white">{t.aiAnalysis}</h2>
              </div>
              <p className="text-xl md:text-2xl text-slate-200 leading-snug mb-10 max-w-5xl font-light tracking-tight">
                &quot;{currentAnalysis.summary}&quot;
              </p>

              <div className="flex flex-wrap gap-4 mb-12">
                {currentAnalysis.strengths.map((strength: string, i: number) => {
                  const Icon = STRENGTH_ICONS[i] || ChevronRight;
                  const tag = lang === 'ko' ?
                    [t.strengthTags.ai, t.strengthTags.automation, t.strengthTags.fullstack, t.strengthTags.dx][i] :
                    [t.strengthTags.ai, t.strengthTags.automation, t.strengthTags.fullstack, t.strengthTags.dx][i];

                  return (
                    <div key={i} className="relative group/tag">
                      <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-cyan-400 text-sm font-black uppercase tracking-widest hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-all cursor-help shadow-lg">
                        <Icon className="w-4 h-4" />
                        #{tag?.replace(/\s+/g, '_')}
                      </div>

                      {/* Hover Description Tooltip */}
                      <div className="absolute bottom-full left-0 mb-4 w-72 p-4 rounded-2xl bg-slate-900/90 backdrop-blur-2xl border border-white/10 shadow-2xl opacity-0 invisible group-hover/tag:opacity-100 group-hover/tag:visible transition-all duration-300 z-30 translate-y-2 group-hover/tag:translate-y-0">
                        <div className="absolute bottom-[-6px] left-6 w-3 h-3 bg-slate-900 border-r border-b border-white/10 rotate-45" />
                        <p className="text-slate-200 text-sm leading-relaxed font-medium">
                          {strength}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* AI Core Capabilities Dynamic Section (Hashtag Style) */}
              {analysis.ai_capabilities && (
                <div className="border-t border-white/5 pt-10 mt-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                      <Brain className="w-6 h-6 text-violet-400" />
                    </div>
                    <h3 className="text-2xl font-black uppercase tracking-tight text-violet-400">{t.aiCapabilities}</h3>
                  </div>

                  <p className="text-xl md:text-2xl text-slate-200 leading-snug mb-10 max-w-5xl font-light tracking-tight">
                    &quot;{lang === 'ko' ? analysis.ko.ai_summary : analysis.en.ai_summary}&quot;
                  </p>

                  <div className="flex flex-wrap gap-4">
                    {analysis.ai_capabilities.map((cap: any, i: number) => {
                      const Icon = CAP_ICONS[cap.key] || Target;
                      const title = (t.aiCaps as any)[cap.key];

                      return (
                        <div key={i} className="relative group/cap">
                          <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-violet-500/5 border border-violet-500/10 text-violet-400 text-sm font-black uppercase tracking-widest hover:bg-violet-500/10 hover:border-violet-500/30 transition-all cursor-help shadow-lg">
                            <Icon className="w-4 h-4" />
                            #{title?.replace(/\s+/g, '_')}
                          </div>

                          {/* Hover Description Tooltip */}
                          <div className="absolute bottom-full left-0 mb-4 w-72 p-4 rounded-2xl bg-slate-900/90 backdrop-blur-2xl border border-white/10 shadow-2xl opacity-0 invisible group-hover/cap:opacity-100 group-hover/cap:visible transition-all duration-300 z-30 translate-y-2 group-hover/cap:translate-y-0">
                            <div className="absolute bottom-[-6px] left-6 w-3 h-3 bg-slate-900 border-r border-b border-white/10 rotate-45" />
                            <p className="text-slate-200 text-sm leading-relaxed font-medium">
                              {lang === 'ko' ? cap.desc_ko : cap.desc_en}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Primary Stack */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
              <Code2 className="w-6 h-6 text-violet-400" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight">{t.primaryStack}</h2>
          </div>

          <div className="bg-slate-900/20 rounded-[2.5rem] p-8 md:p-12 border border-white/5 backdrop-blur-sm">
            <div className="flex h-5 w-full rounded-2xl overflow-hidden mb-12 bg-slate-950 shadow-inner p-1">
              {stats.languages.map((lang: any, i: number) => (
                <div
                  key={i}
                  className={`${getLanguageColor(lang.name)} transition-all hover:brightness-110 relative group/bar`}
                  style={{ width: `${(lang.count / stats.languages.reduce((a: any, b: any) => a + b.count, 0)) * 100}%` }}
                >
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-[10px] rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap border border-white/10 z-20">
                    {lang.name}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
              {stats.languages.map((lang: any, i: number) => (
                <div key={i} className="group/item">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-3 h-3 rounded-full ${getLanguageColor(lang.name)} shadow-[0_0_10px_rgba(255,255,255,0.1)]`} />
                    <span className="text-lg font-bold text-slate-200 group-hover/item:text-white transition-colors">{lang.name}</span>
                  </div>
                  <div className="text-xs text-slate-500 font-mono pl-6 uppercase tracking-widest">{lang.count} {t.repos}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Projects */}
        <section>
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-400" />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight">{t.featuredProjects}</h2>
            </div>
            <a href={user.html_url + '?tab=repositories'} className="group flex items-center gap-2 text-xs font-black text-slate-500 hover:text-cyan-400 transition-all uppercase tracking-[0.2em]">
              {t.viewAll} <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featured.map((repo: any, i: number) => (
              <a
                key={i}
                href={repo.url}
                target="_blank"
                rel="noreferrer"
                className="group bg-slate-900/40 border border-white/5 p-10 rounded-[2.5rem] hover:border-cyan-500/40 hover:bg-slate-900/80 transition-all duration-500 flex flex-col shadow-xl hover:shadow-cyan-500/5"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${pinnedNames.has(repo.name)
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'bg-violet-500/20 text-violet-400 border border-violet-500/30 shadow-[0_0_10px_rgba(139,92,246,0.2)]'}`}>
                    {pinnedNames.has(repo.name) ? (
                      <>
                        <Pin className="w-3 h-3" />
                        {t.badgePride}
                      </>
                    ) : (
                      <>
                        <Cpu className="w-3 h-3" />
                        {t.badgeAiPick}
                      </>
                    )}
                  </div>
                </div>

                <h3 className="font-black text-xl md:text-2xl group-hover:text-cyan-400 transition-all mb-4 uppercase tracking-tighter break-all leading-tight min-h-[3.5rem] flex items-center">
                  {repo.name}
                </h3>
                <p className="text-slate-400 text-sm line-clamp-2 mb-10 flex-1 font-light leading-relaxed group-hover:text-slate-300 transition-colors">
                  {repo.description || t.noDescription}
                </p>

                <div className="flex items-center gap-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                  {repo.primaryLanguage && (
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${getLanguageColor(repo.primaryLanguage.name)}`} />
                      {repo.primaryLanguage.name}
                    </div>
                  )}
                  {repo.stargazerCount > 0 && (
                    <div className="flex items-center gap-1.5 group-hover:text-yellow-400 transition-colors">
                      <Star className="w-3.5 h-3.5" />
                      {repo.stargazerCount}
                    </div>
                  )}
                  {repo.forkCount > 0 && (
                    <div className="flex items-center gap-1.5 group-hover:text-purple-400 transition-colors">
                      <GitFork className="w-3.5 h-3.5" />
                      {repo.forkCount}
                    </div>
                  )}
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Interests / Forks Section */}
        {forks && forks.length > 0 && (
          <section className="mt-32">
             <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                  <Telescope className="w-6 h-6 text-indigo-400" />
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tight text-indigo-400">
                  {analysis.interests?.title || 'Research Radar'}
                </h2>
              </div>

              {analysis.interests && (
                <div className="mb-12">
                   <p className="text-xl md:text-2xl text-slate-200 leading-snug mb-6 max-w-5xl font-light tracking-tight">
                    &quot;{lang === 'ko' ? analysis.interests.desc_ko : analysis.interests.desc_en}&quot;
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {analysis.interests.keywords?.map((keyword: string, i: number) => (
                      <span key={i} className="px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                        #{keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {forks.map((repo: any, i: number) => (
                  <a
                    key={i}
                    href={repo.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group bg-slate-900/40 border border-white/5 p-8 rounded-[2rem] hover:border-indigo-500/40 hover:bg-slate-900/80 transition-all duration-500 flex flex-col shadow-xl hover:shadow-indigo-500/5"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                        <Telescope className="w-3 h-3" />
                        RESEARCH
                      </div>
                    </div>

                    <h3 className="font-black text-lg md:text-xl group-hover:text-indigo-400 transition-all mb-4 uppercase tracking-tighter break-all leading-tight min-h-[3rem] flex items-center">
                      {repo.name}
                    </h3>
                    <p className="text-slate-400 text-xs line-clamp-2 mb-8 flex-1 font-light leading-relaxed group-hover:text-slate-300 transition-colors">
                      {repo.description || t.noDescription}
                    </p>

                    <div className="flex items-center gap-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                      {repo.primaryLanguage && (
                        <div className="flex items-center gap-2">
                          <div className={`w-2.5 h-2.5 rounded-full ${getLanguageColor(repo.primaryLanguage.name)}`} />
                          {repo.primaryLanguage.name}
                        </div>
                      )}
                      {repo.stargazerCount > 0 && (
                        <div className="flex items-center gap-1.5 group-hover:text-yellow-400 transition-colors">
                          <Star className="w-3.5 h-3.5" />
                          {repo.stargazerCount}
                        </div>
                      )}
                    </div>
                  </a>
                ))}
              </div>
          </section>
        )}

        <footer className="mt-32 pt-12 border-t border-white/5 text-center text-slate-700 text-[10px] uppercase tracking-[0.3em] font-black">
          <p>{t.craftedBy}</p>
        </footer>
      </main>
    </div>
  );
}
