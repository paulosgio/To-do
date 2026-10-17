import type { Priority, Task, TaskFilters } from '@/types'

export const priorityMeta: Record<Priority, { label: string; variant: 'destructive' | 'secondary' | 'outline' }> = {
  HIGH: { label: 'Alta', variant: 'destructive' },
  MEDIUM: { label: 'Média', variant: 'secondary' },
  LOW: { label: 'Baixa', variant: 'outline' },
}

const priorityRank: Record<Priority, number> = { LOW: 0, MEDIUM: 1, HIGH: 2 }

/**
 * Aplica no cliente os mesmos filtros/ordenação que o backend aplica.
 * Usado depois de mutações locais (criar, editar, concluir) para a lista
 * refletir a mudança na hora, sem esperar um novo GET.
 */
export function applyView(tasks: Task[], filters: TaskFilters): Task[] {
  const search = filters.search.trim().toLowerCase()

  const visible = tasks.filter((task) => {
    if (filters.status === 'pending' && task.completed) return false
    if (filters.status === 'completed' && !task.completed) return false
    if (filters.priority !== 'ALL' && task.priority !== filters.priority) return false
    if (search) {
      const haystack = `${task.title} ${task.description ?? ''}`.toLowerCase()
      if (!haystack.includes(search)) return false
    }
    return true
  })

  const byNewest = (a: Task, b: Task) => b.createdAt.localeCompare(a.createdAt)

  return visible.sort((a, b) => {
    if (filters.sort === 'oldest') return -byNewest(a, b)
    if (filters.sort === 'priority') {
      return priorityRank[b.priority] - priorityRank[a.priority] || byNewest(a, b)
    }
    return byNewest(a, b)
  })
}

export function hasActiveFilters(filters: TaskFilters): boolean {
  return filters.status !== 'all' || filters.priority !== 'ALL' || filters.search.trim() !== ''
}
