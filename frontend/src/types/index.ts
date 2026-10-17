export type User = {
  id: string
  name: string
  email: string
}

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH'

export type Task = {
  id: string
  title: string
  description: string | null
  priority: Priority
  completed: boolean
  userId: string
  createdAt: string
  updatedAt: string
}

export type TaskStatusFilter = 'all' | 'pending' | 'completed'
export type TaskSort = 'newest' | 'oldest' | 'priority'

export type TaskFilters = {
  status: TaskStatusFilter
  priority: Priority | 'ALL'
  search: string
  sort: TaskSort
}

export type TaskInput = {
  title: string
  description: string | null
  priority: Priority
}

export type TaskUpdate = Partial<TaskInput & { completed: boolean }>
