import { useEffect, useRef } from 'react'
import { useTheme } from '@/hooks/useTheme'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useFileStore } from '@/stores/fileStore'
import { useEditorStore } from '@/stores/editorStore'
import { useFileOperations } from '@/hooks/useFileOperations'
import { FileDropZone } from '@/components/files/FileDropZone'
import { AppShell } from '@/components/layout/AppShell'

export default function App() {
  useTheme()
  useKeyboardShortcuts()

  const loadFileList = useFileStore((s) => s.loadFileList)
  const files = useFileStore((s) => s.files)
  const { openDocument } = useFileOperations()
  const initialized = useRef(false)

  // Load file list on mount
  useEffect(() => {
    loadFileList()
  }, [loadFileList])

  // Open last document (or first) once files are loaded
  useEffect(() => {
    if (initialized.current || files.length === 0) return
    initialized.current = true

    const lastOpenId = localStorage.getItem('markview-last-doc')
    const target = files.find((f) => f.id === lastOpenId) ?? files[0]
    if (target) {
      openDocument(target.id)
    }
  }, [files, openDocument])

  // Persist active document ID
  useEffect(() => {
    const unsub = useEditorStore.subscribe((state) => {
      if (state.activeDocumentId) {
        localStorage.setItem('markview-last-doc', state.activeDocumentId)
      }
    })
    return unsub
  }, [])

  return (
    <FileDropZone>
      <AppShell />
    </FileDropZone>
  )
}
