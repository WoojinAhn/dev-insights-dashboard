import { Code2 } from 'lucide-react';
import { getLanguageColor, getLanguageIcon } from '@/lib/constants';
import type { DashboardStats, LanguageStat } from '@/lib/data';

interface PrimaryStackProps {
  stats: DashboardStats;
  t: { primaryStack: string; repos: string };
}

export function PrimaryStack({ stats, t }: PrimaryStackProps) {
  const total = stats.languages.reduce((a, b) => a + b.count, 0);

  return (
    <section className="mb-20">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
          <Code2 className="w-6 h-6 text-violet-400" />
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tight">{t.primaryStack}</h2>
      </div>

      <div className="bg-slate-900/20 rounded-[2.5rem] p-8 md:p-12 border border-white/5 backdrop-blur-sm">
        <div className="flex h-5 w-full rounded-2xl overflow-hidden mb-12 bg-slate-950 shadow-inner p-1">
          {stats.languages.map((lang: LanguageStat, i: number) => (
            <div
              key={i}
              className={`${getLanguageColor(lang.name)} transition-all hover:brightness-110 relative group/bar`}
              style={{ width: `${(lang.count / total) * 100}%` }}
            >
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-[10px] rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap border border-white/10 z-20">
                {lang.name}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {stats.languages.map((lang: LanguageStat, i: number) => {
            const icon = getLanguageIcon(lang.name);
            return (
              <div key={i} className="group/item">
                <div className="flex items-center gap-3 mb-2">
                  {icon ? (
                    <svg role="img" viewBox="0 0 24 24" className="w-4 h-4 shrink-0" style={{ fill: `#${icon.hex}` }} aria-label={lang.name}>
                      <path d={icon.path} />
                    </svg>
                  ) : (
                    <div className={`w-3 h-3 rounded-full ${getLanguageColor(lang.name)} shadow-[0_0_10px_rgba(255,255,255,0.1)] shrink-0`} />
                  )}
                  <span className="text-lg font-bold text-slate-200 group-hover/item:text-white transition-colors">
                    {lang.name}
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-mono pl-7 uppercase tracking-widest">
                  {lang.count} {t.repos}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
