import { useState } from 'react'
import { Plus, FolderOpen } from '@phosphor-icons/react'
import { useUIStore } from '@/stores/uiStore'
import { useFileOperations } from '@/hooks/useFileOperations'
import { FileList } from '@/components/files/FileList'
import { ImportDialog } from '@/components/files/ImportDialog'
import { Button } from '@/components/ui/Button'

export function Sidebar() {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen)
  const [importOpen, setImportOpen] = useState(false)
  const { createNewDocument } = useFileOperations()

  return (
    <>
      <aside
        className={`flex flex-col h-full bg-surface-secondary border-r border-border transition-all duration-200 overflow-hidden
          ${sidebarOpen ? 'w-64' : 'w-0'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
          <h1 className="text-sm font-bold text-text tracking-tight">Markview</h1>
        </div>

        {/* Actions */}
        <div className="flex gap-1.5 px-3 py-2.5 shrink-0">
          <Button
            variant="primary"
            size="sm"
            className="flex-1"
            onClick={() => createNewDocument()}
          >
            <Plus size={14} weight="bold" />
            New
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
            onClick={() => setImportOpen(true)}
          >
            <FolderOpen size={14} />
            Import
          </Button>
        </div>

        {/* File List */}
        <div className="flex-1 overflow-y-auto">
          <FileList />
        </div>
      </aside>

      <ImportDialog open={importOpen} onClose={() => setImportOpen(false)} />
    </>
  )
}
