'use client';
import { createContext, useContext, useState, useCallback } from 'react';

export interface Tab {
  id: string;
  name: string;
  src: string;
}

interface TabsContextValue {
  tabs: Tab[];
  activeId: string | null;
  openTab: (name: string, src: string) => void;
  closeTab: (id: string) => void;
  setActive: (id: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

export function useTabs() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('useTabs must be used within TabsProvider');
  return ctx;
}

export function TabsProvider({ children }: { children: React.ReactNode }) {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const openTab = useCallback((name: string, src: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const tab: Tab = { id, name, src };
    setTabs(prev => [...prev, tab]);
    setActiveId(id);
  }, []);

  const closeTab = useCallback((id: string) => {
    setTabs(prev => {
      const next = prev.filter(t => t.id !== id);
      return next;
    });
    setActiveId(prev => {
      if (prev !== id) return prev;
      const idx = tabs.findIndex(t => t.id === id);
      const next = tabs.filter(t => t.id !== id);
      if (!next.length) return null;
      return next[Math.max(0, idx - 1)].id;
    });
  }, [tabs]);

  return (
    <TabsContext.Provider value={{ tabs, activeId, openTab, closeTab, setActive: setActiveId }}>
      {children}
    </TabsContext.Provider>
  );
}
