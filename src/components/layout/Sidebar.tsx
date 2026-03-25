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
        <div className="px-5 pt-6 pb-0 shrink-0">
          <h1 className="font-heading italic text-[1.35rem] leading-none text-text tracking-tight">
            vk markdown
          </h1>
          <div className="h-px bg-border mt-4" />
        </div>

        {/* Actions */}
        <div className="flex gap-2 px-4 py-3 shrink-0 border-b border-border">
          <Button
            variant="primary"
            size="sm"
            className="flex-1"
            onClick={() => createNewDocument()}
          >
            <Plus size={13} weight="bold" />
            New
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
            onClick={() => setImportOpen(true)}
          >
            <FolderOpen size={13} />
            Import
          </Button>
        </div>

        {/* Documents label */}
        <div className="px-5 pt-3 pb-1.5 shrink-0">
          <span className="text-[10px] font-sans font-semibold tracking-[0.12em] uppercase text-text-muted">
            Documents
          </span>
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
