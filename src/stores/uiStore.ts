import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ViewMode, ActiveTab, ThemePreference, ResolvedTheme } from '@/types/editor'

interface UIState {
  viewMode: ViewMode
  activeTab: ActiveTab
  sidebarOpen: boolean
  theme: ThemePreference
  resolvedTheme: ResolvedTheme
  splitRatio: number

  setViewMode: (mode: ViewMode) => void
  setActiveTab: (tab: ActiveTab) => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setTheme: (theme: ThemePreference) => void
  setResolvedTheme: (theme: ResolvedTheme) => void
  setSplitRatio: (ratio: number) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      viewMode: 'split',
      activeTab: 'edit',
      sidebarOpen: true,
      theme: 'system',
      resolvedTheme: 'light',
      splitRatio: 0.5,

      setViewMode: (viewMode) => set({ viewMode }),
      setActiveTab: (activeTab) => set({ activeTab }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      setTheme: (theme) => set({ theme }),
      setResolvedTheme: (resolvedTheme) => set({ resolvedTheme }),
      setSplitRatio: (splitRatio) => set({ splitRatio }),
    }),
    {
      name: 'markdown-viewer-ui',
      partialize: (state) => ({
        viewMode: state.viewMode,
        sidebarOpen: state.sidebarOpen,
        theme: state.theme,
        splitRatio: state.splitRatio,
      }),
    },
  ),
)
