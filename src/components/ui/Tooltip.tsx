import type { ReactNode } from 'react'

interface TooltipProps {
  label: string
  shortcut?: string
  children: ReactNode
}

export function Tooltip({ label, shortcut, children }: TooltipProps) {
  return (
    <div className="relative group/tooltip">
      {children}
      <div
        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50
                   pointer-events-none opacity-0 group-hover/tooltip:opacity-100
                   transition-opacity duration-150 delay-300 whitespace-nowrap"
      >
        <div className="bg-surface-elevated border border-border text-text text-xs rounded-md px-2 py-1.5 shadow-lg flex items-center gap-2">
          <span className="text-text-secondary">{label}</span>
          {shortcut && (
            <kbd className="font-mono text-[10px] bg-surface-tertiary border border-border rounded px-1 py-0.5 text-text-muted leading-none">
              {shortcut}
            </kbd>
          )}
        </div>
      </div>
    </div>
  )
}
