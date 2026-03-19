import { useCallback, useRef } from 'react'
import { useEditorStore } from '@/stores/editorStore'
import { useFileStore } from '@/stores/fileStore'
import { getDocument } from '@/lib/db'
import { readFileAsText, downloadAsMarkdown } from '@/lib/fileUtils'

export function useFileOperations() {
  const setActiveDocument = useEditorStore((s) => s.setActiveDocument)
  const clearEditor = useEditorStore((s) => s.clearEditor)
  const createFile = useFileStore((s) => s.createFile)
  const updateFile = useFileStore((s) => s.updateFile)
  const deleteFileFromStore = useFileStore((s) => s.deleteFile)

  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const openDocument = useCallback(
    async (id: string) => {
      const doc = await getDocument(id)
      if (doc) {
        setActiveDocument(id, doc.content)
      }
    },
    [setActiveDocument],
  )

  const saveCurrentDocument = useCallback(async () => {
    const { activeDocumentId, content } = useEditorStore.getState()
    if (!activeDocumentId) return
    const files = useFileStore.getState().files
    const file = files.find((f) => f.id === activeDocumentId)
    if (!file) return
    await updateFile(activeDocumentId, file.name, content)
    useEditorStore.getState().markSaved()
  }, [updateFile])

  const createNewDocument = useCallback(
    async (name = 'Untitled.md', content = '') => {
      const id = await createFile(name, content)
      setActiveDocument(id, content)
      return id
    },
    [createFile, setActiveDocument],
  )

  const deleteDocument = useCallback(
    async (id: string) => {
      const { activeDocumentId } = useEditorStore.getState()
      await deleteFileFromStore(id)
      if (activeDocumentId === id) {
        clearEditor()
      }
    },
    [deleteFileFromStore, clearEditor],
  )

  const importFromFile = useCallback(
    async (file: File) => {
      const content = await readFileAsText(file)
      const name = file.name || 'Imported.md'
      return createNewDocument(name, content)
    },
    [createNewDocument],
  )

  const exportCurrentDocument = useCallback(() => {
    const { activeDocumentId, content } = useEditorStore.getState()
    if (!activeDocumentId) return
    const file = useFileStore.getState().files.find((f) => f.id === activeDocumentId)
    if (!file) return
    downloadAsMarkdown(file.name, content)
  }, [])

  const scheduleAutoSave = useCallback(() => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current)
    }
    autoSaveTimerRef.current = setTimeout(() => {
      saveCurrentDocument()
    }, 1000)
  }, [saveCurrentDocument])

  return {
    openDocument,
    saveCurrentDocument,
    createNewDocument,
    deleteDocument,
    importFromFile,
    exportCurrentDocument,
    scheduleAutoSave,
  }
}
