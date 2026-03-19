export type ViewMode = 'split' | 'tabs'
export type ActiveTab = 'edit' | 'preview'
export type ThemePreference = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

export interface CursorPosition {
  line: number
  col: number
}
