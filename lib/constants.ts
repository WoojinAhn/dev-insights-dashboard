export const LANGUAGE_COLORS: Record<string, string> = {
  Java: 'bg-orange-600',
  Python: 'bg-blue-500',
  TypeScript: 'bg-cyan-400',
  JavaScript: 'bg-yellow-400',
  Shell: 'bg-green-500',
  HTML: 'bg-orange-400',
  CSS: 'bg-violet-500',
  C: 'bg-slate-500',
  'C++': 'bg-pink-500',
  Rust: 'bg-red-500',
};

export const getLanguageColor = (lang: string) => LANGUAGE_COLORS[lang] || 'bg-slate-400';
