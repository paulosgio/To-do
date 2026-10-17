import type { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors/AppError.js";

export const notFoundHandler: RequestHandler = (_req, res) => {
  res.status(404).json({ message: "Rota não encontrada" });
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    res.status(400).json({
      message: "Dados inválidos",
      issues: err.issues.map((issue) => ({ path: issue.path.join("."), message: issue.message })),
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  // JSON malformado no corpo da requisição (lançado pelo express.json)
  if (err instanceof SyntaxError && "status" in err && err.status === 400) {
    res.status(400).json({ message: "JSON inválido" });
    return;
  }

  console.error(err);
  res.status(500).json({ message: "Erro interno do servidor" });
};
