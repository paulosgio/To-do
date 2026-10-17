import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { getErrorMessage } from '@/lib/errors'
import { tasksService } from '@/services/tasks'
import type { Task, TaskFilters, TaskInput, TaskUpdate } from '@/types'
import { applyView } from './taskView'

export function useTasks(filters: TaskFilters) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [hasLoaded, setHasLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    tasksService
      .list(filters, controller.signal)
      .then((data) => {
        setTasks(data)
        setError(null)
        setHasLoaded(true)
      })
      .catch((err: unknown) => {
        if (axios.isCancel(err)) return
        setError(getErrorMessage(err, 'Não foi possível carregar as tarefas.'))
        setHasLoaded(true)
      })

    // Cancela a busca anterior se os filtros mudarem antes de ela terminar.
    return () => controller.abort()
  }, [filters])

  const createTask = useCallback(
    async (input: TaskInput): Promise<boolean> => {
      try {
        const created = await tasksService.create(input)
        setTasks((prev) => applyView([created, ...prev], filters))
        toast.success('Tarefa criada')
        return true
      } catch (err) {
        toast.error(getErrorMessage(err, 'Não foi possível criar a tarefa.'))
        return false
      }
    },
    [filters],
  )

  // Otimista: aplica a mudança antes da resposta e desfaz só esta tarefa se falhar.
  const updateTask = useCallback(
    async (original: Task, changes: TaskUpdate): Promise<boolean> => {
      setTasks((prev) => applyView(replaceTask(prev, { ...original, ...changes }), filters))
      try {
        const saved = await tasksService.update(original.id, changes)
        setTasks((prev) => applyView(replaceTask(prev, saved), filters))
        return true
      } catch (err) {
        setTasks((prev) => applyView(replaceTask(prev, original), filters))
        toast.error(getErrorMessage(err, 'Não foi possível salvar a tarefa.'))
        return false
      }
    },
    [filters],
  )

  const deleteTask = useCallback(
    async (task: Task): Promise<void> => {
      setTasks((prev) => prev.filter((item) => item.id !== task.id))
      try {
        await tasksService.remove(task.id)
        toast.success('Tarefa excluída')
      } catch (err) {
        setTasks((prev) => applyView([task, ...prev], filters))
        toast.error(getErrorMessage(err, 'Não foi possível excluir a tarefa.'))
      }
    },
    [filters],
  )

  return { tasks, hasLoaded, error, createTask, updateTask, deleteTask }
}

/** Substitui a tarefa pelo id; se ela tinha saído da lista (filtro), recoloca. */
function replaceTask(tasks: Task[], next: Task): Task[] {
  const exists = tasks.some((task) => task.id === next.id)
  return exists ? tasks.map((task) => (task.id === next.id ? next : task)) : [next, ...tasks]
}
