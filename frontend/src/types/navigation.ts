import type { SvgIconComponent } from '@mui/icons-material'

export interface NavigationChildItem {
  label: string
  path: string
}

export interface NavigationItem {
  label: string
  path: string
  icon: SvgIconComponent
  badge?: string
  children?: NavigationChildItem[]
}
