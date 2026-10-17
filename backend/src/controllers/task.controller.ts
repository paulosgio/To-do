import type { Request, Response } from "express";
import {
  createTaskSchema,
  listTasksQuerySchema,
  taskIdParamsSchema,
  updateTaskSchema,
} from "../dtos/task.dto.js";
import { getUserId } from "../middlewares/authenticate.js";
import { taskService } from "../services/task.service.js";

export const taskController = {
  async list(req: Request, res: Response) {
    const query = listTasksQuerySchema.parse(req.query);
    res.json({ tasks: await taskService.list(getUserId(req), query) });
  },

  async create(req: Request, res: Response) {
    const input = createTaskSchema.parse(req.body);
    res.status(201).json({ task: await taskService.create(getUserId(req), input) });
  },

  async update(req: Request, res: Response) {
    const { id } = taskIdParamsSchema.parse(req.params);
    const input = updateTaskSchema.parse(req.body);
    res.json({ task: await taskService.update(getUserId(req), id, input) });
  },

  async delete(req: Request, res: Response) {
    const { id } = taskIdParamsSchema.parse(req.params);
    await taskService.delete(getUserId(req), id);
    res.status(204).end();
  },
};
