import { prisma } from "../configs/prisma.js";
import type { Prisma } from "../generated/prisma/client.js";
import type { CreateTaskInput, ListTasksQuery, UpdateTaskInput } from "../dtos/task.dto.js";

export const taskRepository = {
  listByUser(userId: string, query: ListTasksQuery) {
    const where: Prisma.TaskWhereInput = { userId };

    if (query.status !== "all") {
      where.completed = query.status === "completed";
    }
    if (query.priority) {
      where.priority = query.priority;
    }
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: "insensitive" } },
        { description: { contains: query.search, mode: "insensitive" } },
      ];
    }

    // No Postgres o enum ordena pela ordem de declaração (LOW < MEDIUM < HIGH).
    const orderBy: Prisma.TaskOrderByWithRelationInput[] =
      query.sort === "priority"
        ? [{ priority: query.order }, { createdAt: "desc" }]
        : [{ createdAt: query.order }];

    return prisma.task.findMany({ where, orderBy });
  },

  findByIdForUser(id: string, userId: string) {
    return prisma.task.findFirst({ where: { id, userId } });
  },

  create(userId: string, data: CreateTaskInput) {
    return prisma.task.create({ data: { ...data, userId } });
  },

  update(id: string, data: UpdateTaskInput) {
    return prisma.task.update({ where: { id }, data });
  },

  delete(id: string) {
    return prisma.task.delete({ where: { id } });
  },
};
