import { useState, useCallback, useRef, type ReactNode } from 'react'
import { useUIStore } from '@/stores/uiStore'

interface SplitPaneProps {
  left: ReactNode
  right: ReactNode
}

export function SplitPane({ left, right }: SplitPaneProps) {
  const splitRatio = useUIStore((s) => s.splitRatio)
  const setSplitRatio = useUIStore((s) => s.setSplitRatio)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      setIsDragging(true)

      const handleMouseMove = (moveEvent: MouseEvent) => {
        if (!containerRef.current) return
        const rect = containerRef.current.getBoundingClientRect()
        const ratio = (moveEvent.clientX - rect.left) / rect.width
        setSplitRatio(Math.max(0.2, Math.min(0.8, ratio)))
      }

      const handleMouseUp = () => {
        setIsDragging(false)
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    },
    [setSplitRatio],
  )

  return (
    <div ref={containerRef} className="flex h-full w-full overflow-hidden">
      <div
        style={{ width: `${splitRatio * 100}%` }}
        className={`h-full overflow-hidden ${isDragging ? 'pointer-events-none select-none' : ''}`}
      >
        {left}
      </div>

      <div
        className={`relative w-0 flex-shrink-0 cursor-col-resize group ${isDragging ? 'z-10' : ''}`}
        onMouseDown={handleMouseDown}
      >
        <div
          className={`absolute inset-y-0 -left-px w-[3px] transition-colors duration-150
            ${isDragging ? 'bg-accent' : 'bg-border hover:bg-accent/50'}`}
        />
      </div>

      <div
        style={{ width: `${(1 - splitRatio) * 100}%` }}
        className={`h-full overflow-hidden ${isDragging ? 'pointer-events-none select-none' : ''}`}
      >
        {right}
      </div>
    </div>
  )
}
