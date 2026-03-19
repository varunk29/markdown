import { useEffect } from 'react'
import { useUIStore } from '@/stores/uiStore'
import { useFileOperations } from './useFileOperations'

export function useKeyboardShortcuts() {
  const { saveCurrentDocument, createNewDocument, exportCurrentDocument } = useFileOperations()
  const toggleSidebar = useUIStore((s) => s.toggleSidebar)
  const setViewMode = useUIStore((s) => s.setViewMode)
  const viewMode = useUIStore((s) => s.viewMode)
  const theme = useUIStore((s) => s.theme)
  const setTheme = useUIStore((s) => s.setTheme)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey

      if (mod && e.key === 's') {
        e.preventDefault()
        saveCurrentDocument()
      }

      if (mod && e.key === 'n') {
        e.preventDefault()
        createNewDocument()
      }

      if (mod && e.key === 'b') {
        e.preventDefault()
        toggleSidebar()
      }

      if (mod && e.key === 'e' && !e.shiftKey) {
        e.preventDefault()
        exportCurrentDocument()
      }

      if (mod && e.shiftKey && e.key === 'E') {
        e.preventDefault()
        setViewMode(viewMode === 'split' ? 'tabs' : 'split')
      }

      if (mod && e.key === 'd') {
        e.preventDefault()
        const next = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'
        setTheme(next)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [saveCurrentDocument, createNewDocument, exportCurrentDocument, toggleSidebar, setViewMode, viewMode, theme, setTheme])
}
