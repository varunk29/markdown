import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8 py-16">
      <div className="text-text-muted mb-5">{icon}</div>
      <h3 className="font-heading italic text-xl text-text mb-2 tracking-tight">{title}</h3>
      <p className="text-sm text-text-muted max-w-xs mb-6 leading-relaxed">{description}</p>
      {action}
    </div>
  )
}
