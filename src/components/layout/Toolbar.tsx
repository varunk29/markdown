import { useState } from 'react'
import {
  List,
  Columns,
  Tabs,
  PencilSimple,
  Eye,
  DownloadSimple,
  FloppyDisk,
  Check,
} from '@phosphor-icons/react'
import { useUIStore } from '@/stores/uiStore'
import { useEditorStore } from '@/stores/editorStore'
import { useFileStore } from '@/stores/fileStore'
import { useFileOperations } from '@/hooks/useFileOperations'
import { downloadAsMarkdown } from '@/lib/fileUtils'
import { IconButton } from '@/components/ui/IconButton'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

export function Toolbar() {
  const viewMode = useUIStore((s) => s.viewMode)
  const setViewMode = useUIStore((s) => s.setViewMode)
  const activeTab = useUIStore((s) => s.activeTab)
  const setActiveTab = useUIStore((s) => s.setActiveTab)
  const toggleSidebar = useUIStore((s) => s.toggleSidebar)
  const isDirty = useEditorStore((s) => s.isDirty)
  const activeDocumentId = useEditorStore((s) => s.activeDocumentId)
  const content = useEditorStore((s) => s.content)
  const files = useFileStore((s) => s.files)
  const { saveCurrentDocument } = useFileOperations()
  const [saving, setSaving] = useState(false)

  const activeFile = files.find((f) => f.id === activeDocumentId)

  const handleSave = async () => {
    setSaving(true)
    await saveCurrentDocument()
    setTimeout(() => setSaving(false), 1000)
  }

  const handleExport = () => {
    if (!activeFile) return
    downloadAsMarkdown(activeFile.name, content)
  }

  return (
    <div className="flex items-center h-11 px-2 gap-1 border-b border-border bg-surface-secondary shrink-0">
      <IconButton label="Toggle sidebar" shortcut="⌘B" onClick={toggleSidebar} size="sm">
        <List size={18} />
      </IconButton>

      <div className="w-px h-5 bg-border mx-1" />

      {activeFile && (
        <span className="text-[13px] font-medium text-text-secondary truncate max-w-48 px-2 tracking-tight">
          {activeFile.name}
        </span>
      )}

      <div className="flex-1" />

      {/* View mode toggle */}
      <div className="flex items-center bg-surface-tertiary rounded-lg p-0.5 gap-0.5">
        <IconButton
          label="Split view"
          shortcut="⌘⇧E"
          size="sm"
          active={viewMode === 'split'}
          onClick={() => setViewMode('split')}
        >
          <Columns size={16} />
        </IconButton>
        <IconButton
          label="Tab view"
          shortcut="⌘⇧E"
          size="sm"
          active={viewMode === 'tabs'}
          onClick={() => setViewMode('tabs')}
        >
          <Tabs size={16} />
        </IconButton>
      </div>

      {viewMode === 'tabs' && (
        <>
          <div className="w-px h-5 bg-border mx-1" />
          <div className="flex items-center bg-surface-tertiary rounded-lg p-0.5 gap-0.5">
            <IconButton
              label="Editor"
              size="sm"
              active={activeTab === 'edit'}
              onClick={() => setActiveTab('edit')}
            >
              <PencilSimple size={16} />
            </IconButton>
            <IconButton
              label="Preview"
              size="sm"
              active={activeTab === 'preview'}
              onClick={() => setActiveTab('preview')}
            >
              <Eye size={16} />
            </IconButton>
          </div>
        </>
      )}

      <div className="w-px h-5 bg-border mx-1" />

      <ThemeToggle />

      {activeDocumentId && (
        <>
          <IconButton label="Export as .md" shortcut="⌘E" onClick={handleExport} size="sm">
            <DownloadSimple size={18} />
          </IconButton>

          <IconButton
            label={isDirty ? 'Save' : 'Saved'}
            shortcut="⌘S"
            onClick={handleSave}
            size="sm"
          >
            {saving ? (
              <Check size={18} weight="bold" className="text-success" />
            ) : (
              <FloppyDisk
                size={18}
                weight={isDirty ? 'fill' : 'regular'}
                className={isDirty ? 'text-accent' : ''}
              />
            )}
          </IconButton>
        </>
      )}
    </div>
  )
}
