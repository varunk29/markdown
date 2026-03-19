import { useFileStore } from '@/stores/fileStore'
import { useEditorStore } from '@/stores/editorStore'
import { useFileOperations } from '@/hooks/useFileOperations'
import { FileItem } from './FileItem'
import { EmptyState } from '@/components/ui/EmptyState'
import { FileText } from '@phosphor-icons/react'

export function FileList() {
  const files = useFileStore((s) => s.files)
  const activeDocumentId = useEditorStore((s) => s.activeDocumentId)
  const renameFile = useFileStore((s) => s.renameFile)
  const { openDocument, deleteDocument } = useFileOperations()

  if (files.length === 0) {
    return (
      <EmptyState
        icon={<FileText size={40} weight="thin" />}
        title="No documents"
        description="Create a new document or import a markdown file."
      />
    )
  }

  return (
    <div className="flex flex-col gap-0.5 px-2 py-1">
      {files.map((file) => (
        <FileItem
          key={file.id}
          file={file}
          isActive={file.id === activeDocumentId}
          onOpen={openDocument}
          onDelete={deleteDocument}
          onRename={renameFile}
        />
      ))}
    </div>
  )
}
