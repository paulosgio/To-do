import { z } from "zod";

export const priorityValues = ["LOW", "MEDIUM", "HIGH"] as const;

const title = z.string().trim().min(1, "Informe um título").max(120, "Título muito longo");

// String vazia vira null para que "apagar a descrição" funcione tanto com "" quanto com null.
const description = z
  .string()
  .trim()
  .max(1000, "Descrição muito longa")
  .nullable()
  .transform((value) => (value ? value : null));

const priority = z.enum(priorityValues, "Prioridade inválida");

export const createTaskSchema = z.object({
  title,
  description: description.optional(),
  priority: priority.default("MEDIUM"),
});

export const updateTaskSchema = z
  .object({
    title: title.optional(),
    description: description.optional(),
    priority: priority.optional(),
    completed: z.boolean().optional(),
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "Informe ao menos um campo para atualizar",
  });

export const taskIdParamsSchema = z.object({
  id: z.uuid("ID de tarefa inválido"),
});

export const listTasksQuerySchema = z.object({
  status: z.enum(["all", "pending", "completed"]).default("all"),
  priority: priority.optional(),
  search: z.string().trim().max(120).optional(),
  sort: z.enum(["createdAt", "priority"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type ListTasksQuery = z.infer<typeof listTasksQuerySchema>;
