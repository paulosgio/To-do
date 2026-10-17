import { ListChecks } from 'lucide-react'

export function AppLogo() {
  return (
    <span className="flex items-center gap-2 font-heading text-lg font-semibold">
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <ListChecks className="size-4" aria-hidden />
      </span>
      Tarefas
    </span>
  )
}
