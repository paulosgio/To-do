import { Search } from 'lucide-react'
import { motion } from 'motion/react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import type { Priority, TaskSort, TaskStatusFilter } from '@/types'

const statusOptions: { value: TaskStatusFilter; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'pending', label: 'Pendentes' },
  { value: 'completed', label: 'Concluídas' },
]

type TaskFiltersBarProps = {
  status: TaskStatusFilter
  priority: Priority | 'ALL'
  search: string
  sort: TaskSort
  onStatusChange: (value: TaskStatusFilter) => void
  onPriorityChange: (value: Priority | 'ALL') => void
  onSearchChange: (value: string) => void
  onSortChange: (value: TaskSort) => void
}

export function TaskFiltersBar(props: TaskFiltersBarProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <Label htmlFor="task-search" className="sr-only">
          Buscar tarefas
        </Label>
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <Input
          id="task-search"
          type="search"
          placeholder="Buscar por título ou descrição"
          value={props.search}
          onChange={(event) => props.onSearchChange(event.target.value)}
          className="pl-9"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Controle segmentado: o fundo do item ativo desliza entre as opções (layoutId). */}
        <div role="group" aria-label="Filtrar por status" className="inline-flex w-full rounded-lg bg-muted p-1 sm:w-auto">
          {statusOptions.map((option) => {
            const isActive = props.status === option.value
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={isActive}
                onClick={() => props.onStatusChange(option.value)}
                className={cn(
                  'relative flex-1 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 sm:flex-none',
                  isActive && 'text-foreground',
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="status-filter-pill"
                    className="absolute inset-0 rounded-md bg-background shadow-xs"
                    transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                  />
                )}
                <span className="relative">{option.label}</span>
              </button>
            )
          })}
        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex">
          <Select value={props.priority} onValueChange={(value) => props.onPriorityChange(value as Priority | 'ALL')}>
            <SelectTrigger aria-label="Filtrar por prioridade" className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todas as prioridades</SelectItem>
              <SelectItem value="HIGH">Prioridade alta</SelectItem>
              <SelectItem value="MEDIUM">Prioridade média</SelectItem>
              <SelectItem value="LOW">Prioridade baixa</SelectItem>
            </SelectContent>
          </Select>

          <Select value={props.sort} onValueChange={(value) => props.onSortChange(value as TaskSort)}>
            <SelectTrigger aria-label="Ordenar tarefas" className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Mais recentes</SelectItem>
              <SelectItem value="oldest">Mais antigas</SelectItem>
              <SelectItem value="priority">Por prioridade</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
