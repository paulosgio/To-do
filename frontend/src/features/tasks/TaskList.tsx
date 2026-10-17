import { ClipboardList, SearchX } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { Skeleton } from '@/components/ui/skeleton'
import type { Task } from '@/types'
import { TaskItem } from './TaskItem'

type TaskListProps = {
  tasks: Task[]
  isLoading: boolean
  isFiltered: boolean
  onToggle: (task: Task) => void
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
}

export function TaskList({ tasks, isLoading, isFiltered, onToggle, onEdit, onDelete }: TaskListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2" aria-busy="true" aria-label="Carregando tarefas">
        {[0, 1, 2].map((key) => (
          <Skeleton key={key} className="h-20 rounded-xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="relative">
      {/* "popLayout" tira o item que sai do fluxo na hora, e os vizinhos deslizam para o lugar dele. */}
      <ul className="relative flex flex-col gap-2">
        <AnimatePresence mode="popLayout">
          {tasks.map((task, index) => (
            <TaskItem
              key={task.id}
              task={task}
              index={index}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </AnimatePresence>
      </ul>

      <AnimatePresence>
        {tasks.length === 0 && (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
            className="flex flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-12 text-center"
          >
            {isFiltered ? (
              <SearchX className="size-8 text-muted-foreground" aria-hidden />
            ) : (
              <ClipboardList className="size-8 text-muted-foreground" aria-hidden />
            )}
            <div className="space-y-1">
              <p className="font-medium">{isFiltered ? 'Nenhuma tarefa encontrada' : 'Nenhuma tarefa ainda'}</p>
              <p className="text-sm text-muted-foreground">
                {isFiltered ? 'Tente ajustar a busca ou os filtros.' : 'Crie sua primeira tarefa para começar.'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
