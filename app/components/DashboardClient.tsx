'use client';

import { useState, useEffect } from 'react';
import { translations, Lang } from '@/lib/translations';
import type { DashboardData } from '@/lib/data';
import { NavigationHeader } from './NavigationHeader';
import { ProfileSection } from './ProfileSection';
import { StatsGrid } from './StatsGrid';
import { AiAnalysis } from './AiAnalysis';
import { PrimaryStack } from './PrimaryStack';
import { FeaturedProjects } from './FeaturedProjects';
import { ResearchRadar } from './ResearchRadar';
import { DashboardFooter } from './DashboardFooter';

interface DashboardClientProps {
  data: DashboardData;
}

export function DashboardClient({ data }: DashboardClientProps) {
  const [lang, setLang] = useState<Lang>('ko');
  const [scrolled, setScrolled] = useState(false);

  const t = translations[lang];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/10 blur-[120px] pointer-events-none animate-pulse" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-500/10 blur-[120px] pointer-events-none animate-pulse" />

      <NavigationHeader scrolled={scrolled} lang={lang} setLang={setLang} />

      <main className="max-w-6xl mx-auto px-6 pt-32 pb-12 relative z-10">
        <ProfileSection user={data.user} t={t} />
        <StatsGrid stats={data.stats} user={data.user} t={t} />
        <AiAnalysis analysis={data.analysis} lang={lang} t={t} />
        <PrimaryStack stats={data.stats} t={t} />
        <FeaturedProjects featured={data.featured} pinned={data.pinned} user={data.user} aiSignals={data.aiSignals} t={t} />
        <ResearchRadar forks={data.forks} t={t} />
        <DashboardFooter meta={data.meta} lang={lang} t={t} />
      </main>
    </div>
  );
}
