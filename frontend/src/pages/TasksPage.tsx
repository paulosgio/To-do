import { Plus } from 'lucide-react'
import { motion } from 'motion/react'
import { useMemo, useState } from 'react'
import { FormAlert } from '@/components/shared/FormAlert'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { TaskFiltersBar } from '@/features/tasks/TaskFiltersBar'
import { TaskFormDialog } from '@/features/tasks/TaskFormDialog'
import { TaskList } from '@/features/tasks/TaskList'
import { hasActiveFilters } from '@/features/tasks/taskView'
import { useTasks } from '@/features/tasks/useTasks'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { AppLayout } from '@/layouts/AppLayout'
import { useAuthStore } from '@/stores/authStore'
import type { Priority, Task, TaskFilters, TaskSort, TaskStatusFilter } from '@/types'

const MotionButton = motion.create(Button)

export function TasksPage() {
  const userName = useAuthStore((state) => state.user?.name)

  const [status, setStatus] = useState<TaskStatusFilter>('all')
  const [priority, setPriority] = useState<Priority | 'ALL'>('ALL')
  const [sort, setSort] = useState<TaskSort>('newest')
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search)

  // Objeto estável: o useTasks refaz a busca só quando algum filtro muda de fato.
  const filters = useMemo<TaskFilters>(
    () => ({ status, priority, sort, search: debouncedSearch }),
    [status, priority, sort, debouncedSearch],
  )
  const { tasks, hasLoaded, error, createTask, updateTask, deleteTask } = useTasks(filters)

  const [formOpen, setFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null)

  function openCreate() {
    setEditingTask(null)
    setFormOpen(true)
  }

  function openEdit(task: Task) {
    setEditingTask(task)
    setFormOpen(true)
  }

  const firstName = userName?.split(' ')[0]

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <h1 className="font-heading text-2xl font-semibold tracking-tight">
              {firstName ? `Olá, ${firstName}` : 'Suas tarefas'}
            </h1>
            <p className="text-sm text-muted-foreground">Organize o que precisa ser feito.</p>
          </div>
          <MotionButton whileTap={{ scale: 0.97 }} onClick={openCreate} className="w-full sm:w-auto">
            <Plus aria-hidden />
            Nova tarefa
          </MotionButton>
        </div>

        <TaskFiltersBar
          status={status}
          priority={priority}
          search={search}
          sort={sort}
          onStatusChange={setStatus}
          onPriorityChange={setPriority}
          onSearchChange={setSearch}
          onSortChange={setSort}
        />

        <FormAlert message={error ?? undefined} />

        <TaskList
          tasks={tasks}
          isLoading={!hasLoaded}
          isFiltered={hasActiveFilters(filters)}
          onToggle={(task) => updateTask(task, { completed: !task.completed })}
          onEdit={openEdit}
          onDelete={setTaskToDelete}
        />
      </div>

      <TaskFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        task={editingTask}
        onSubmit={(input) => (editingTask ? updateTask(editingTask, input) : createTask(input))}
      />

      <AlertDialog open={taskToDelete !== null} onOpenChange={(open) => !open && setTaskToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir tarefa?</AlertDialogTitle>
            <AlertDialogDescription>
              {taskToDelete ? `"${taskToDelete.title}" será excluída permanentemente.` : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (taskToDelete) void deleteTask(taskToDelete)
              }}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  )
}
