import { memo, useState, useRef, useEffect } from 'react'
import { FileText, Trash, PencilSimple } from '@phosphor-icons/react'
import type { FileMetadata } from '@/types/document'
import { formatFileSize } from '@/lib/fileUtils'

interface FileItemProps {
  file: FileMetadata
  isActive: boolean
  onOpen: (id: string) => void
  onDelete: (id: string) => void
  onRename: (id: string, name: string) => void
}

export const FileItem = memo(function FileItem({
  file,
  isActive,
  onOpen,
  onDelete,
  onRename,
}: FileItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(file.name)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleSubmitRename = () => {
    const trimmed = editName.trim()
    if (trimmed && trimmed !== file.name) {
      onRename(file.id, trimmed)
    } else {
      setEditName(file.name)
    }
    setIsEditing(false)
  }

  const timeAgo = getTimeAgo(file.updatedAt)

  return (
    <div
      className={`group flex items-start gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors duration-100
        ${isActive ? 'bg-accent-muted' : 'hover:bg-surface-tertiary'}`}
      onClick={() => onOpen(file.id)}
    >
      <FileText
        size={18}
        weight={isActive ? 'fill' : 'regular'}
        className={`mt-0.5 shrink-0 ${isActive ? 'text-accent' : 'text-text-muted'}`}
      />
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            ref={inputRef}
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleSubmitRename}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmitRename()
              if (e.key === 'Escape') {
                setEditName(file.name)
                setIsEditing(false)
              }
            }}
            onClick={(e) => e.stopPropagation()}
            className="w-full bg-surface border border-border rounded px-1.5 py-0.5 text-sm text-text outline-none focus:border-accent"
          />
        ) : (
          <p className={`text-sm font-medium truncate ${isActive ? 'text-accent' : 'text-text'}`}>
            {file.name}
          </p>
        )}
        <p className="text-xs text-text-muted mt-0.5">
          {timeAgo} · {formatFileSize(file.size)}
        </p>
      </div>
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation()
            setEditName(file.name)
            setIsEditing(true)
          }}
          className="p-1 text-text-muted hover:text-text rounded transition-colors cursor-pointer"
          aria-label="Rename"
        >
          <PencilSimple size={14} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete(file.id)
          }}
          className="p-1 text-text-muted hover:text-danger rounded transition-colors cursor-pointer"
          aria-label="Delete"
        >
          <Trash size={14} />
        </button>
      </div>
    </div>
  )
})

function getTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(timestamp).toLocaleDateString()
}
