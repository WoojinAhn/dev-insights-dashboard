'use client';

import React, { useState, useEffect } from 'react';
import { Cpu } from 'lucide-react';
import { translations, Lang } from '@/lib/translations';
import { useDashboardData } from './hooks/useDashboardData';
import { NavigationHeader } from './components/NavigationHeader';
import { ProfileSection } from './components/ProfileSection';
import { StatsGrid } from './components/StatsGrid';
import { AiAnalysis } from './components/AiAnalysis';
import { PrimaryStack } from './components/PrimaryStack';
import { FeaturedProjects } from './components/FeaturedProjects';
import { ResearchRadar } from './components/ResearchRadar';
import { DashboardFooter } from './components/DashboardFooter';

export default function Dashboard() {
  const [lang, setLang] = useState<Lang>('ko');
  const [scrolled, setScrolled] = useState(false);
  const { data, isLoading } = useDashboardData();

  const t = translations[lang];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
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

  if (!data) return null;

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
        <FeaturedProjects featured={data.featured} pinned={data.pinned} user={data.user} t={t} />
        <ResearchRadar forks={data.forks} t={t} />
        <DashboardFooter meta={data.meta} lang={lang} t={t} />
      </main>
    </div>
  );
}
