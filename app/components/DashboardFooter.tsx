import { Sparkles, Bot } from 'lucide-react';
import type { Meta } from '@/lib/data';
import type { Lang } from '@/lib/translations';

interface DashboardFooterProps {
  meta?: Meta;
  lang: Lang;
  t: { builtFor: string };
}

export function DashboardFooter({ meta, lang, t }: DashboardFooterProps) {
  return (
    <footer className="mt-32 pt-12 border-t border-white/5 text-center text-slate-700 text-[10px] uppercase tracking-[0.3em] font-black">
      <div className="flex items-center justify-center gap-3">
        <span>{t.builtFor}</span>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-blue-400/60" title="Gemini">
            <Sparkles className="w-3 h-3" />
          </span>
          <span className="text-slate-800">+</span>
          <span className="flex items-center gap-1 text-amber-400/60" title="Claude">
            <Bot className="w-3 h-3" />
          </span>
        </div>
      </div>
      {meta?.last_updated && (
        <p className="mt-2 text-slate-800">
          Last updated:{' '}
          {new Date(meta.last_updated).toLocaleDateString(lang === 'ko' ? 'ko-KR' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Asia/Seoul',
          })}{' '}
          KST
        </p>
      )}
    </footer>
  );
}
