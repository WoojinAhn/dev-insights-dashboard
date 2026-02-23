import { Github, MapPin, Link as LinkIcon } from 'lucide-react';
import type { User } from '@/lib/data';

interface ProfileSectionProps {
  user: User;
  t: { headerTitle: string };
}

export function ProfileSection({ user, t }: ProfileSectionProps) {
  return (
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
          {user.name || user.login}
          {t.headerTitle}
        </h1>
        <p className="text-slate-400 text-xl mb-6 max-w-2xl font-light leading-relaxed italic">
          &quot;{user.bio}&quot;
        </p>

        <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm">
          <a
            href={user.html_url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-slate-500 hover:text-cyan-400 transition-colors font-medium"
          >
            <Github className="w-5 h-5" /> @{user.login}
          </a>
          {user.location && (
            <div className="flex items-center gap-2 text-slate-500">
              <MapPin className="w-5 h-5" /> {user.location}
            </div>
          )}
          {user.blog && (
            <a
              href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-slate-500 hover:text-cyan-400 transition-colors"
            >
              <LinkIcon className="w-5 h-5" /> {user.blog.replace(/https?:\/\//, '')}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
