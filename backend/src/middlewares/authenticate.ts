import type { RequestHandler } from "express";
import { AppError } from "../errors/AppError.js";
import { verifyAccessToken } from "../utils/tokens.js";

export const authenticate: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    throw new AppError("Token de acesso ausente", 401);
  }

  req.userId = verifyAccessToken(header.slice("Bearer ".length));
  next();
};

/** Para handlers que rodam depois de `authenticate`. */
export function getUserId(req: { userId?: string }): string {
  if (!req.userId) {
    throw new AppError("Não autenticado", 401);
  }
  return req.userId;
}
