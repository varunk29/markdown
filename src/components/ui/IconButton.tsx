import { type ButtonHTMLAttributes, forwardRef } from 'react'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  size?: 'sm' | 'md'
  active?: boolean
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ label, size = 'md', active = false, className = '', children, ...props }, ref) => {
    const sizeClass = size === 'sm' ? 'h-7 w-7' : 'h-8 w-8'
    return (
      <button
        ref={ref}
        title={label}
        aria-label={label}
        className={`inline-flex items-center justify-center rounded-lg transition-colors duration-150 cursor-pointer
          ${active ? 'bg-accent-muted text-accent' : 'text-text-secondary hover:bg-surface-tertiary hover:text-text'}
          disabled:opacity-50 disabled:cursor-not-allowed ${sizeClass} ${className}`}
        {...props}
      >
        {children}
      </button>
    )
  },
)
