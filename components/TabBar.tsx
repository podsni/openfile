'use client';
import { X, Plus } from 'lucide-react';
import { useTabs } from './TabsProvider';
import Link from 'next/link';
import { useTheme } from './ThemeProvider';
import { Sun, Moon } from 'lucide-react';

export function TabBar() {
  const { tabs, activeId, setActive, closeTab } = useTabs();
  const { dark, toggle } = useTheme();

  return (
    <header className="flex flex-col shrink-0 bg-[#0c0c0e] border-b border-white/[0.06]">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.04]">
        <Link
          href="/"
          className="text-[12px] font-medium tracking-[0.12em] uppercase text-zinc-500 hover:text-zinc-300 transition-colors duration-200"
        >
          OpenFile
        </Link>
        <div className="flex items-center gap-1">
          <Link
            href="/"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.05] transition-all duration-200"
          >
            <Plus size={12} />
            <span className="hidden sm:inline tracking-wide">Open</span>
          </Link>
          <button
            onClick={toggle}
            className="p-1.5 rounded-lg hover:bg-white/[0.05] transition-all duration-200 text-zinc-600 hover:text-zinc-300"
            aria-label="Toggle theme"
          >
            {dark ? <Sun size={13} /> : <Moon size={13} />}
          </button>
        </div>
      </div>

      {/* Tabs row */}
      {tabs.length > 0 && (
        <div className="flex overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`group flex items-center gap-2 px-4 py-2.5 text-[12px] border-r border-white/[0.04] shrink-0 max-w-[180px] transition-all duration-200
                ${activeId === tab.id
                  ? 'bg-white/[0.04] text-zinc-200 border-b border-b-zinc-400/40'
                  : 'text-zinc-600 hover:text-zinc-400 hover:bg-white/[0.02]'
                }`}
            >
              <span className="truncate flex-1 text-left">{tab.name}</span>
              <span
                role="button"
                tabIndex={0}
                onClick={e => { e.stopPropagation(); closeTab(tab.id); }}
                onKeyDown={e => e.key === 'Enter' && closeTab(tab.id)}
                className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-white/[0.08] transition-all duration-150 shrink-0 text-zinc-600 hover:text-zinc-300"
                aria-label={`Close ${tab.name}`}
              >
                <X size={10} />
              </span>
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
