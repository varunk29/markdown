import { useState, useRef } from 'react'
import { Dialog } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { useFileOperations } from '@/hooks/useFileOperations'
import { UploadSimple, ClipboardText } from '@phosphor-icons/react'

interface ImportDialogProps {
  open: boolean
  onClose: () => void
}

export function ImportDialog({ open, onClose }: ImportDialogProps) {
  const [mode, setMode] = useState<'upload' | 'paste'>('upload')
  const [pasteName, setPasteName] = useState('')
  const [pasteContent, setPasteContent] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { importFromFile, createNewDocument } = useFileOperations()

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    for (const file of Array.from(files)) {
      await importFromFile(file)
    }
    onClose()
    resetForm()
  }

  const handlePasteSubmit = async () => {
    if (!pasteContent.trim()) return
    const name = pasteName.trim() || 'Pasted.md'
    await createNewDocument(name, pasteContent)
    onClose()
    resetForm()
  }

  const resetForm = () => {
    setPasteName('')
    setPasteContent('')
    setMode('upload')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <Dialog open={open} onClose={onClose} title="Import Markdown">
      <div className="flex gap-1 mb-4 bg-surface-tertiary rounded-lg p-1">
        <button
          onClick={() => setMode('upload')}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer
            ${mode === 'upload' ? 'bg-surface text-text shadow-sm' : 'text-text-muted hover:text-text'}`}
        >
          <UploadSimple size={16} />
          Upload File
        </button>
        <button
          onClick={() => setMode('paste')}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer
            ${mode === 'paste' ? 'bg-surface text-text shadow-sm' : 'text-text-muted hover:text-text'}`}
        >
          <ClipboardText size={16} />
          Paste Content
        </button>
      </div>

      {mode === 'upload' ? (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".md,.markdown,.txt"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex flex-col items-center gap-3 p-8 border-2 border-dashed border-border rounded-xl hover:border-accent hover:bg-accent-muted/30 transition-colors cursor-pointer"
          >
            <UploadSimple size={36} weight="duotone" className="text-text-muted" />
            <div className="text-center">
              <p className="text-sm font-medium text-text">Click to choose files</p>
              <p className="text-xs text-text-muted mt-1">.md, .markdown, or .txt</p>
            </div>
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <input
            value={pasteName}
            onChange={(e) => setPasteName(e.target.value)}
            placeholder="Document name (optional)"
            className="w-full bg-surface-secondary border border-border rounded-lg px-3 py-2 text-sm text-text placeholder-text-muted outline-none focus:border-accent transition-colors"
          />
          <textarea
            value={pasteContent}
            onChange={(e) => setPasteContent(e.target.value)}
            placeholder="Paste your markdown content here..."
            rows={8}
            className="w-full bg-surface-secondary border border-border rounded-lg px-3 py-2 text-sm text-text placeholder-text-muted outline-none focus:border-accent transition-colors resize-none font-mono"
          />
          <Button
            variant="primary"
            onClick={handlePasteSubmit}
            disabled={!pasteContent.trim()}
          >
            Import
          </Button>
        </div>
      )}
    </Dialog>
  )
}
