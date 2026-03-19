import { useEditorStore } from '@/stores/editorStore'
import { getWordCount, getReadTime, formatFileSize } from '@/lib/fileUtils'

export function StatusBar() {
  const content = useEditorStore((s) => s.content)
  const cursorPosition = useEditorStore((s) => s.cursorPosition)
  const activeDocumentId = useEditorStore((s) => s.activeDocumentId)

  if (!activeDocumentId) return null

  const wordCount = getWordCount(content)
  const lineCount = content.split('\n').length

  return (
    <div className="flex items-center h-7 px-3 gap-4 border-t border-border bg-surface-secondary text-xs text-text-muted shrink-0">
      <span>
        Ln {cursorPosition.line}, Col {cursorPosition.col}
      </span>
      <span>{lineCount} lines</span>
      <span>{wordCount} words</span>
      <span>{formatFileSize(new TextEncoder().encode(content).length)}</span>
      <div className="flex-1" />
      <span>{getReadTime(wordCount)}</span>
    </div>
  )
}
