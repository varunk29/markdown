import { useState, useCallback, type ReactNode } from 'react'
import { useFileOperations } from '@/hooks/useFileOperations'
import { UploadSimple } from '@phosphor-icons/react'

interface FileDropZoneProps {
  children: ReactNode
}

export function FileDropZone({ children }: FileDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const { importFromFile } = useFileOperations()

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer.types.includes('Files')) {
      setIsDragging(true)
    }
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const { clientX, clientY } = e
    if (
      clientX <= rect.left ||
      clientX >= rect.right ||
      clientY <= rect.top ||
      clientY >= rect.bottom
    ) {
      setIsDragging(false)
    }
  }, [])

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      const files = Array.from(e.dataTransfer.files)
      const mdFiles = files.filter((f) =>
        /\.(md|markdown|txt)$/i.test(f.name),
      )

      for (const file of mdFiles) {
        await importFromFile(file)
      }
    },
    [importFromFile],
  )

  return (
    <div
      className="relative w-full h-full"
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {children}
      {isDragging && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-surface/90 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 p-8 rounded-2xl border-2 border-dashed border-accent bg-accent-muted/50">
            <UploadSimple size={48} weight="duotone" className="text-accent" />
            <div className="text-center">
              <p className="text-lg font-semibold text-text">Drop your files here</p>
              <p className="text-sm text-text-muted">.md, .markdown, or .txt files</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
