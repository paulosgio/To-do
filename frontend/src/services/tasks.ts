import { api } from '@/lib/api'
import type { Task, TaskFilters, TaskInput, TaskUpdate } from '@/types'

function toQueryParams(filters: TaskFilters) {
  return {
    status: filters.status,
    priority: filters.priority === 'ALL' ? undefined : filters.priority,
    search: filters.search.trim() || undefined,
    sort: filters.sort === 'priority' ? 'priority' : 'createdAt',
    order: filters.sort === 'oldest' ? 'asc' : 'desc',
  }
}

export const tasksService = {
  async list(filters: TaskFilters, signal?: AbortSignal) {
    const { data } = await api.get<{ tasks: Task[] }>('/tasks', { params: toQueryParams(filters), signal })
    return data.tasks
  },

  async create(input: TaskInput) {
    const { data } = await api.post<{ task: Task }>('/tasks', input)
    return data.task
  },

  async update(id: string, input: TaskUpdate) {
    const { data } = await api.patch<{ task: Task }>(`/tasks/${id}`, input)
    return data.task
  },

  async remove(id: string) {
    await api.delete(`/tasks/${id}`)
  },
}
