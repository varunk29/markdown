import { memo, useState, useRef, useEffect } from 'react'
import { Trash, PencilSimple } from '@phosphor-icons/react'
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
      className={`group relative flex items-start px-4 py-2.5 cursor-pointer transition-colors duration-100 border-b border-border/50
        ${isActive ? 'bg-accent-muted' : 'hover:bg-surface-tertiary'}`}
      onClick={() => onOpen(file.id)}
    >
      {isActive && (
        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-accent" />
      )}

      <div className="flex-1 min-w-0 pl-1">
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
            className="w-full bg-surface border border-accent rounded px-1.5 py-0.5 text-[13px] text-text outline-none font-sans"
          />
        ) : (
          <p className={`text-[13px] font-medium leading-snug truncate ${isActive ? 'text-accent' : 'text-text'}`}>
            {file.name}
          </p>
        )}
        <p className="text-[11px] text-text-muted mt-0.5 font-mono tracking-tight">
          {timeAgo} · {formatFileSize(file.size)}
        </p>
      </div>

      <div className="flex items-center gap-0 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-1 mt-0.5">
        <button
          onClick={(e) => {
            e.stopPropagation()
            setEditName(file.name)
            setIsEditing(true)
          }}
          className="p-1 text-text-muted hover:text-text rounded transition-colors cursor-pointer"
          aria-label="Rename"
        >
          <PencilSimple size={13} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete(file.id)
          }}
          className="p-1 text-text-muted hover:text-danger rounded transition-colors cursor-pointer"
          aria-label="Delete"
        >
          <Trash size={13} />
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
