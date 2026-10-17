import type { CreateTaskInput, ListTasksQuery, UpdateTaskInput } from "../dtos/task.dto.js";
import { AppError } from "../errors/AppError.js";
import { taskRepository } from "../repositories/task.repository.js";

async function findOwnedTaskOrFail(id: string, userId: string) {
  const task = await taskRepository.findByIdForUser(id, userId);
  // 404 (e não 403) para tarefas de outro usuário: não revela que o ID existe.
  if (!task) {
    throw new AppError("Tarefa não encontrada", 404);
  }
  return task;
}

export const taskService = {
  list(userId: string, query: ListTasksQuery) {
    return taskRepository.listByUser(userId, query);
  },

  create(userId: string, input: CreateTaskInput) {
    return taskRepository.create(userId, input);
  },

  async update(userId: string, id: string, input: UpdateTaskInput) {
    await findOwnedTaskOrFail(id, userId);
    return taskRepository.update(id, input);
  },

  async delete(userId: string, id: string): Promise<void> {
    await findOwnedTaskOrFail(id, userId);
    await taskRepository.delete(id);
  },
};
