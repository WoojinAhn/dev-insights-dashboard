import { Star, GitFork, ChevronRight, Pin, Cpu } from 'lucide-react';
import { siClaude, siCursor, siGooglegemini, siGithubcopilot, siWindsurf } from 'simple-icons';
import { getLanguageColor, getLanguageIcon } from '@/lib/constants';
import type { Repository, PinnedRepository, User } from '@/lib/data';

interface FeaturedProjectsProps {
  featured: (Repository | PinnedRepository)[];
  pinned: PinnedRepository[];
  user: User;
  aiSignals: Record<string, string[]>;
  aiPickReasons: Record<string, { reason_en: string; reason_ko: string }>;
  lang: string;
  t: {
    featuredProjects: string;
    viewAll: string;
    noDescription: string;
    badgePride: string;
    badgeAiPick: string;
  };
}

const TOOL_CONFIG: Record<string, { icon?: { path: string }; label: string }> = {
  'claude-code': { icon: siClaude, label: 'Claude Code' },
  'claude-api':  { icon: siClaude, label: 'Claude API' },
  'cursor':      { icon: siCursor, label: 'Cursor' },
  'openai':      { label: 'OpenAI' },
  'gemini':      { icon: siGooglegemini, label: 'Gemini' },
  'copilot':     { icon: siGithubcopilot, label: 'GitHub Copilot' },
  'windsurf':    { icon: siWindsurf, label: 'Windsurf' },
};

function AiToolBadge({ toolId }: { toolId: string }) {
  const config = TOOL_CONFIG[toolId];
  if (!config) return null;

  return (
    <span
      title={config.label}
      className="text-slate-500 group-hover:text-slate-400 transition-colors"
    >
      {config.icon ? (
        <svg
          role="img"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          className="w-3.5 h-3.5"
          fill="currentColor"
          aria-label={config.label}
        >
          <path d={config.icon.path} />
        </svg>
      ) : (
        <span className="text-[9px] font-black uppercase tracking-widest">{config.label}</span>
      )}
    </span>
  );
}

export function FeaturedProjects({ featured, pinned, user, aiSignals, aiPickReasons, lang, t }: FeaturedProjectsProps) {
  const pinnedNames = new Set(pinned.map((p) => p.name));

  return (
    <section>
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
            <Star className="w-6 h-6 text-yellow-400" />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight">{t.featuredProjects}</h2>
        </div>
        <a
          href={user.html_url + '?tab=repositories'}
          className="group flex items-center gap-2 text-xs font-black text-slate-500 hover:text-cyan-400 transition-all uppercase tracking-[0.2em]"
        >
          {t.viewAll} <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featured.map((repo, i: number) => {
          const tools = aiSignals[repo.name] ?? [];
          const langIcon = repo.primaryLanguage ? getLanguageIcon(repo.primaryLanguage.name) : null;
          const isPinned = pinnedNames.has(repo.name);
          const isAiPick = !isPinned && !!aiPickReasons[repo.name];
          const pickReason = isAiPick ? aiPickReasons[repo.name] : undefined;
          const reasonText = pickReason ? (lang === 'ko' ? pickReason.reason_ko : pickReason.reason_en) : undefined;
          return (
            <a
              key={i}
              href={repo.url}
              target="_blank"
              rel="noreferrer"
              className="group bg-slate-900/40 border border-white/5 p-10 rounded-[2.5rem] hover:border-cyan-500/40 hover:bg-slate-900/80 transition-all duration-500 flex flex-col shadow-xl hover:shadow-cyan-500/5"
            >
              <div className="flex items-center justify-between mb-6 min-h-[1.5rem]">
                {(isPinned || isAiPick) && (
                  <div className="relative group/badge">
                    <div
                      className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
                        isPinned
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                          : 'bg-violet-500/20 text-violet-400 border border-violet-500/30 shadow-[0_0_10px_rgba(139,92,246,0.2)]'
                      }`}
                    >
                      {isPinned ? (
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
                    {reasonText && (
                      <div className="absolute left-0 top-full mt-2 z-50 w-64 px-4 py-3 rounded-xl bg-slate-800/95 backdrop-blur-sm border border-violet-500/20 shadow-xl shadow-violet-500/10 text-violet-300/90 text-xs leading-relaxed italic opacity-0 invisible group-hover/badge:opacity-100 group-hover/badge:visible transition-all duration-200 pointer-events-none">
                        {reasonText}
                      </div>
                    )}
                  </div>
                )}
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
                    {langIcon ? (
                      <svg role="img" viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" style={{ fill: `#${langIcon.hex}` }} aria-label={repo.primaryLanguage.name}>
                        <path d={langIcon.path} />
                      </svg>
                    ) : (
                      <div className={`w-2.5 h-2.5 rounded-full ${getLanguageColor(repo.primaryLanguage.name)} shrink-0`} />
                    )}
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
                {tools.length > 0 && (
                  <div className="ml-auto flex items-center gap-2">
                    {tools.map((toolId) => (
                      <AiToolBadge key={toolId} toolId={toolId} />
                    ))}
                  </div>
                )}
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
