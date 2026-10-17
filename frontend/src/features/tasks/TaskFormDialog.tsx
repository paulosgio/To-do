import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { FormField } from '@/components/shared/FormField'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { Task, TaskInput } from '@/types'

// Espelha createTaskSchema/updateTaskSchema do backend.
const taskFormSchema = z.object({
  title: z.string().trim().min(1, 'Informe um título').max(120, 'Título muito longo'),
  description: z.string().trim().max(1000, 'Descrição muito longa'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
})

type TaskFormValues = z.infer<typeof taskFormSchema>

type TaskFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** null = criar nova tarefa */
  task: Task | null
  onSubmit: (input: TaskInput) => Promise<boolean>
}

export function TaskFormDialog({ open, onOpenChange, task, onSubmit }: TaskFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{task ? 'Editar tarefa' : 'Nova tarefa'}</DialogTitle>
          <DialogDescription>
            {task ? 'Altere os dados e salve.' : 'Dê um título e, se quiser, uma descrição e a prioridade.'}
          </DialogDescription>
        </DialogHeader>
        {/* key: remonta o formulário com os valores certos a cada abertura. */}
        <TaskForm
          key={task?.id ?? 'new'}
          task={task}
          onSubmit={async (input) => {
            if (await onSubmit(input)) onOpenChange(false)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}

function TaskForm({ task, onSubmit }: { task: Task | null; onSubmit: (input: TaskInput) => Promise<void> }) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: task?.title ?? '',
      description: task?.description ?? '',
      priority: task?.priority ?? 'MEDIUM',
    },
  })

  return (
    <form
      noValidate
      className="grid gap-4"
      onSubmit={handleSubmit((values) =>
        onSubmit({ ...values, description: values.description ? values.description : null }),
      )}
    >
      <FormField id="task-title" label="Título" error={errors.title?.message}>
        <Input
          id="task-title"
          autoFocus
          aria-invalid={!!errors.title}
          aria-describedby="task-title-error"
          {...register('title')}
        />
      </FormField>

      <FormField id="task-description" label="Descrição (opcional)" error={errors.description?.message}>
        <Textarea
          id="task-description"
          rows={4}
          aria-invalid={!!errors.description}
          aria-describedby="task-description-error"
          {...register('description')}
        />
      </FormField>

      <FormField id="task-priority" label="Prioridade" error={errors.priority?.message}>
        <Controller
          control={control}
          name="priority"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="task-priority" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HIGH">Alta</SelectItem>
                <SelectItem value="MEDIUM">Média</SelectItem>
                <SelectItem value="LOW">Baixa</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </FormField>

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">
            Cancelar
          </Button>
        </DialogClose>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : task ? 'Salvar alterações' : 'Criar tarefa'}
        </Button>
      </DialogFooter>
    </form>
  )
}
