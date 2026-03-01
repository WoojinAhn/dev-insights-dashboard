import {
  siTypescript, siJavascript, siPython, siOpenjdk, siRust,
  siHtml5, siCss, siGnubash, siC, siCplusplus, siSwift,
} from 'simple-icons';

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
  Swift: 'bg-orange-500',
};

export const getLanguageColor = (lang: string) => LANGUAGE_COLORS[lang] || 'bg-slate-400';

export interface LanguageIcon {
  path: string;
  hex: string;
}

const LANGUAGE_ICONS: Record<string, LanguageIcon> = {
  TypeScript: siTypescript,
  JavaScript: siJavascript,
  Python: siPython,
  Java: siOpenjdk,
  Rust: siRust,
  HTML: siHtml5,
  CSS: siCss,
  Shell: siGnubash,
  C: siC,
  'C++': siCplusplus,
  Swift: siSwift,
};

export const getLanguageIcon = (lang: string): LanguageIcon | null =>
  LANGUAGE_ICONS[lang] ?? null;
