import { Workflow, Brain, Telescope } from 'lucide-react';
import type { Analysis, AiCapability, AnalysisInterestKeyword } from '@/lib/data';
import type { Lang } from '@/lib/translations';

interface AiAnalysisProps {
  analysis: Analysis;
  lang: Lang;
  t: {
    aiAnalysis: string;
    aiCapabilities: string;
  };
}

export function AiAnalysis({ analysis, lang, t }: AiAnalysisProps) {
  const currentAnalysis = lang === 'ko' ? analysis.ko : analysis.en;

  return (
    <section className="mb-20">
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-white/5 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden group shadow-2xl">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-500/10 blur-[80px] group-hover:bg-cyan-500/20 transition-all duration-1000" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
              <Workflow className="w-6 h-6 text-cyan-400" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-white">{t.aiAnalysis}</h2>
            {analysis.model_provider && (
              <span className="ml-3 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase tracking-widest">
                Powered by {analysis.model_provider}
              </span>
            )}
          </div>
          <p className="text-xl md:text-2xl text-slate-200 leading-snug mb-10 max-w-5xl font-light tracking-tight">
            &quot;{currentAnalysis.summary}&quot;
          </p>

          <div className="flex flex-wrap gap-4 mb-12">
            {currentAnalysis.strengths.map((item, i: number) => {
              const tag = lang === 'ko' ? item.tag_ko : item.tag_en;

              return (
                <div key={i} className="relative group/tag">
                  <div className="px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-cyan-400 text-sm font-black uppercase tracking-widest hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-all cursor-help shadow-lg">
                    #{tag?.replace(/\s+/g, '_')}
                  </div>
                  <div className="absolute bottom-full left-0 mb-4 w-72 p-4 rounded-2xl bg-slate-900/90 backdrop-blur-2xl border border-white/10 shadow-2xl opacity-0 invisible group-hover/tag:opacity-100 group-hover/tag:visible transition-all duration-300 z-30 translate-y-2 group-hover/tag:translate-y-0">
                    <div className="absolute bottom-[-6px] left-6 w-3 h-3 bg-slate-900 border-r border-b border-white/10 rotate-45" />
                    <div className="text-slate-200 text-sm leading-relaxed font-medium">
                      <p className="font-black text-cyan-400 mb-1 uppercase text-[10px] tracking-wider">{item.strength}</p>
                      <p className="font-light">{item.evidence}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

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
                {analysis.ai_capabilities.map((cap: AiCapability, i: number) => {
                  const title = lang === 'ko' ? cap.title_ko : cap.title_en;

                  return (
                    <div key={i} className="relative group/cap">
                      <div className="px-5 py-2.5 rounded-2xl bg-violet-500/5 border border-violet-500/10 text-violet-400 text-sm font-black uppercase tracking-widest hover:bg-violet-500/10 hover:border-violet-500/30 transition-all cursor-help shadow-lg">
                        #{title?.replace(/\s+/g, '_')}
                      </div>
                      <div className="absolute bottom-full left-0 mb-4 w-72 p-4 rounded-2xl bg-slate-900/90 backdrop-blur-2xl border border-white/10 shadow-2xl opacity-0 invisible group-hover/cap:opacity-100 group-hover/cap:visible transition-all duration-300 z-30 translate-y-2 group-hover/cap:translate-y-0">
                        <div className="absolute bottom-[-6px] left-6 w-3 h-3 bg-slate-900 border-r border-b border-white/10 rotate-45" />
                        <div className="text-slate-200 text-sm leading-relaxed font-medium">
                          <p className="font-black text-violet-400 mb-1 uppercase text-[10px] tracking-wider">{title}</p>
                          <p className="font-light">{lang === 'ko' ? cap.desc_ko : cap.desc_en}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {analysis.interests && (
            <div className="border-t border-white/5 pt-10 mt-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                  <Telescope className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight text-indigo-400">
                  {lang === 'ko' ? analysis.interests.title_ko : analysis.interests.title_en}
                </h3>
              </div>

              <p className="text-xl md:text-2xl text-slate-200 leading-snug mb-10 max-w-5xl font-light tracking-tight">
                &quot;{lang === 'ko' ? analysis.interests.desc_ko : analysis.interests.desc_en}&quot;
              </p>

              <div className="flex flex-wrap gap-4">
                {analysis.interests.keywords?.map((keyword: AnalysisInterestKeyword, i: number) => (
                  <div key={i} className="relative group/interest">
                    <div className="px-5 py-2.5 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 text-indigo-400 text-sm font-black uppercase tracking-widest hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all cursor-help shadow-lg">
                      #{keyword.name?.replace(/\s+/g, '_')}
                    </div>
                    <div className="absolute bottom-full left-0 mb-4 w-72 p-4 rounded-2xl bg-slate-900/90 backdrop-blur-2xl border border-white/10 shadow-2xl opacity-0 invisible group-hover/interest:opacity-100 group-hover/interest:visible transition-all duration-300 z-30 translate-y-2 group-hover/interest:translate-y-0">
                      <div className="absolute bottom-[-6px] left-6 w-3 h-3 bg-slate-900 border-r border-b border-white/10 rotate-45" />
                      <div className="text-slate-200 text-sm leading-relaxed font-medium">
                        <p className="font-black text-indigo-400 mb-1 uppercase text-[10px] tracking-wider">{keyword.name}</p>
                        <p className="font-light">{lang === 'ko' ? keyword.desc_ko : keyword.desc_en}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
