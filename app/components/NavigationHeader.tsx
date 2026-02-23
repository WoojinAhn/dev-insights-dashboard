import { Github } from 'lucide-react';
import type { Lang } from '@/lib/translations';

interface NavigationHeaderProps {
  scrolled: boolean;
  lang: Lang;
  setLang: (lang: Lang) => void;
}

export function NavigationHeader({ scrolled, lang, setLang }: NavigationHeaderProps) {
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-4 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 shadow-2xl' : 'py-8'}`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <div
          className="flex items-center gap-3 group cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-500 p-[1px]">
            <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center">
              <Github className="w-5 h-5 text-white" />
            </div>
          </div>
          <span className="font-black text-xl tracking-tighter hidden sm:block">
            DEV.<span className="text-cyan-400">INSIGHTS</span>
          </span>
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
  );
}
