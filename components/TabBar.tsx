'use client';
import { X, FileText, Plus } from 'lucide-react';
import { useTabs } from './TabsProvider';
import Link from 'next/link';
import { useTheme } from './ThemeProvider';
import { Sun, Moon } from 'lucide-react';

function fileIcon(name: string) {
  return <FileText size={13} className="shrink-0 text-zinc-500" />;
}

export function TabBar() {
  const { tabs, activeId, setActive, closeTab } = useTabs();
  const { dark, toggle } = useTheme();

  return (
    <header className="flex flex-col shrink-0 border-b border-zinc-800 bg-zinc-950">
      {/* Top bar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800/60">
        <Link href="/" className="flex items-center gap-1.5 text-sm font-semibold tracking-tight hover:text-indigo-400 transition">
          <FileText size={16} className="text-indigo-400" />
          OpenFile
        </Link>
        <div className="flex items-center gap-1">
          <Link
            href="/"
            className="flex items-center gap-1 px-2 py-1 rounded text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition"
          >
            <Plus size={13} />
            <span className="hidden sm:inline">Open</span>
          </Link>
          <button
            onClick={toggle}
            className="p-1.5 rounded hover:bg-zinc-800 transition text-zinc-400 hover:text-zinc-200"
            aria-label="Toggle theme"
          >
            {dark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </div>

      {/* Tabs row */}
      {tabs.length > 0 && (
        <div className="flex overflow-x-auto scrollbar-none">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`group flex items-center gap-1.5 px-3 py-2 text-xs border-r border-zinc-800 shrink-0 max-w-[160px] sm:max-w-[200px] transition
                ${activeId === tab.id
                  ? 'bg-zinc-900 text-zinc-100 border-b-2 border-b-indigo-500'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'
                }`}
            >
              {fileIcon(tab.name)}
              <span className="truncate flex-1 text-left">{tab.name}</span>
              <span
                role="button"
                tabIndex={0}
                onClick={e => { e.stopPropagation(); closeTab(tab.id); }}
                onKeyDown={e => e.key === 'Enter' && closeTab(tab.id)}
                className="ml-1 p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-zinc-700 transition shrink-0"
                aria-label={`Close ${tab.name}`}
              >
                <X size={11} />
              </span>
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
