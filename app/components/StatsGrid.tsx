import { Star, GitFork, Code2, Layers, Users } from 'lucide-react';
import type { User, DashboardStats } from '@/lib/data';

interface StatsGridProps {
  stats: DashboardStats;
  user: User;
  t: {
    repositories: string;
    followers: string;
    totalStars: string;
    forksEarned: string;
    topLang: string;
  };
}

export function StatsGrid({ stats, user, t }: StatsGridProps) {
  const items = [
    { label: t.repositories, value: user.public_repos, icon: Layers, color: 'from-blue-500 to-cyan-500' },
    { label: t.followers, value: user.followers, icon: Users, color: 'from-green-500 to-emerald-500' },
    { label: t.totalStars, value: stats.totalStars, icon: Star, color: 'from-yellow-500 to-orange-500' },
    { label: t.forksEarned, value: stats.totalForks, icon: GitFork, color: 'from-purple-500 to-pink-500' },
    { label: t.topLang, value: stats.languages[0]?.name || 'N/A', icon: Code2, color: 'from-cyan-500 to-blue-500' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-8 mb-20">
      {items.map((stat, i) => (
        <div key={i} className="relative group overflow-hidden">
          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-6 md:p-8 rounded-[2rem] hover:border-white/10 transition-all duration-500 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</p>
              <div className={`p-2 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-10`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-3xl md:text-4xl font-black font-mono tracking-tighter group-hover:scale-105 transition-transform origin-left duration-500">
              {stat.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
