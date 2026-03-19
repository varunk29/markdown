import { useEffect } from 'react'
import { useUIStore } from '@/stores/uiStore'

export function useTheme() {
  const theme = useUIStore((s) => s.theme)
  const setResolvedTheme = useUIStore((s) => s.setResolvedTheme)

  useEffect(() => {
    const root = document.documentElement

    function apply(resolved: 'light' | 'dark') {
      if (resolved === 'dark') {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
      setResolvedTheme(resolved)
    }

    if (theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      apply(mq.matches ? 'dark' : 'light')

      const handler = (e: MediaQueryListEvent) => apply(e.matches ? 'dark' : 'light')
      mq.addEventListener('change', handler)
      return () => mq.removeEventListener('change', handler)
    } else {
      apply(theme)
    }
  }, [theme, setResolvedTheme])
}
