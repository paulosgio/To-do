import { Router } from "express";
import { taskController } from "../controllers/task.controller.js";
import { authenticate } from "../middlewares/authenticate.js";

export const taskRoutes = Router();

taskRoutes.use(authenticate);

taskRoutes.get("/", taskController.list);
taskRoutes.post("/", taskController.create);
taskRoutes.patch("/:id", taskController.update);
taskRoutes.delete("/:id", taskController.delete);
