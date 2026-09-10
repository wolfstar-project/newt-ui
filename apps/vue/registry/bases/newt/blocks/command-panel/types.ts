export interface CommandPanelOption {
  name: string
  type?: string
  required?: boolean
  description?: string
}

export interface CommandPanelCommand {
  id: string
  name: string
  description: string
  appLabel?: string
  options?: readonly CommandPanelOption[]
}
