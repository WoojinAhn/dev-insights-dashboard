import { Star, Layers, Telescope } from 'lucide-react';
import { getLanguageColor } from '@/lib/constants';
import type { ForkRepository } from '@/lib/data';

interface ResearchRadarProps {
  forks: ForkRepository[];
  t: { noDescription: string };
}

export function ResearchRadar({ forks, t }: ResearchRadarProps) {
  if (!forks || forks.length === 0) return null;

  return (
    <section className="mt-32">
      <div className="flex items-center gap-3 mb-12">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
          <Layers className="w-6 h-6 text-indigo-400" />
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tight text-indigo-400">Research Radar</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {forks.map((repo: ForkRepository, i: number) => (
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
              {(repo.parent?.stargazerCount || repo.stargazerCount) > 0 && (
                <div className="flex items-center gap-1.5 group-hover:text-yellow-400 transition-colors">
                  <Star className="w-3.5 h-3.5" />
                  {repo.parent?.stargazerCount || repo.stargazerCount}
                </div>
              )}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
