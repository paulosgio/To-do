import { Pencil, Trash2 } from 'lucide-react'
import { motion } from 'motion/react'
import type { Ref } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import type { Task } from '@/types'
import { priorityMeta } from './taskView'

type TaskItemProps = {
  task: Task
  index: number
  onToggle: (task: Task) => void
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
  // O AnimatePresence em modo "popLayout" precisa do ref do elemento raiz.
  ref?: Ref<HTMLLIElement>
}

export function TaskItem({ task, index, onToggle, onEdit, onDelete, ref }: TaskItemProps) {
  const priority = priorityMeta[task.priority]
  const checkboxId = `task-${task.id}`

  return (
    <motion.li
      ref={ref}
      layout="position"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0, transition: { delay: Math.min(index * 0.04, 0.3) } }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.15 } }}
      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
      className="group flex items-start gap-3 rounded-xl border bg-card p-4 shadow-xs"
    >
      <motion.div whileTap={{ scale: 0.8 }} className="flex pt-0.5">
        <Checkbox
          id={checkboxId}
          checked={task.completed}
          onCheckedChange={() => onToggle(task)}
          aria-label={task.completed ? 'Marcar como pendente' : 'Marcar como concluída'}
        />
      </motion.div>

      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          {/* O risco aparece animando a cor da decoração (funciona em títulos com várias linhas). */}
          <label
            htmlFor={checkboxId}
            className={cn(
              'cursor-pointer font-medium break-words line-through decoration-transparent transition-colors duration-300',
              task.completed && 'text-muted-foreground decoration-muted-foreground',
            )}
          >
            {task.title}
          </label>
          <Badge variant={priority.variant}>{priority.label}</Badge>
        </div>
        {task.description && (
          <p className="text-sm whitespace-pre-line break-words text-muted-foreground">{task.description}</p>
        )}
      </div>

      <div className="flex shrink-0 gap-1 transition-opacity sm:opacity-0 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100">
        <Button variant="ghost" size="icon-sm" aria-label={`Editar "${task.title}"`} onClick={() => onEdit(task)}>
          <Pencil />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Excluir "${task.title}"`}
          className="text-muted-foreground hover:text-destructive"
          onClick={() => onDelete(task)}
        >
          <Trash2 />
        </Button>
      </div>
    </motion.li>
  )
}
