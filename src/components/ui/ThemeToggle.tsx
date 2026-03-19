import { Sun, Moon, Monitor } from '@phosphor-icons/react'
import { useUIStore } from '@/stores/uiStore'
import { IconButton } from './IconButton'
import type { ThemePreference } from '@/types/editor'

const cycle: ThemePreference[] = ['system', 'light', 'dark']
const icons: Record<ThemePreference, typeof Sun> = {
  system: Monitor,
  light: Sun,
  dark: Moon,
}
const labels: Record<ThemePreference, string> = {
  system: 'System theme',
  light: 'Light mode',
  dark: 'Dark mode',
}

export function ThemeToggle() {
  const theme = useUIStore((s) => s.theme)
  const setTheme = useUIStore((s) => s.setTheme)

  const next = () => {
    const idx = cycle.indexOf(theme)
    setTheme(cycle[(idx + 1) % cycle.length]!)
  }

  const Icon = icons[theme]

  return (
    <IconButton label={labels[theme]} shortcut="⌘D" onClick={next} size="sm">
      <Icon size={18} weight="duotone" />
    </IconButton>
  )
}
