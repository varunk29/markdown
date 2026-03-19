import { memo, useRef, useCallback, useMemo } from 'react'
import { useCodeMirror } from './useCodeMirror'
import { useUIStore } from '@/stores/uiStore'
import { useEditorStore } from '@/stores/editorStore'
import { useFileOperations } from '@/hooks/useFileOperations'

export const MarkdownEditor = memo(function MarkdownEditor() {
  const containerRef = useRef<HTMLDivElement>(null)
  const resolvedTheme = useUIStore((s) => s.resolvedTheme)
  const activeDocumentId = useEditorStore((s) => s.activeDocumentId)
  const setContent = useEditorStore((s) => s.setContent)
  const setCursorPosition = useEditorStore((s) => s.setCursorPosition)
  const { scheduleAutoSave } = useFileOperations()

  // Snapshot content only when document switches (not on every keystroke)
  const initialContent = useMemo(
    () => useEditorStore.getState().content,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeDocumentId],
  )

  const handleChange = useCallback(
    (newContent: string) => {
      setContent(newContent)
      scheduleAutoSave()
    },
    [setContent, scheduleAutoSave],
  )

  useCodeMirror({
    containerRef,
    initialContent,
    onChange: handleChange,
    onCursorChange: setCursorPosition,
    theme: resolvedTheme,
  })

  return (
    <div
      ref={containerRef}
      className="h-full w-full overflow-hidden bg-surface"
    />
  )
})
