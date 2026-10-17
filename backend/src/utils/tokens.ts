import { createHash, randomBytes } from "node:crypto";
import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../configs/env.js";
import { AppError } from "../errors/AppError.js";

export function signAccessToken(userId: string): string {
  return jwt.sign({}, env.JWT_ACCESS_SECRET, {
    subject: userId,
    expiresIn: env.ACCESS_TOKEN_TTL as NonNullable<SignOptions["expiresIn"]>,
    algorithm: "HS256",
  });
}

/** Retorna o id do usuário contido no token ou lança 401. */
export function verifyAccessToken(token: string): string {
  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET, { algorithms: ["HS256"] });
    if (typeof payload === "string" || !payload.sub) {
      throw new Error("Payload sem subject");
    }
    return payload.sub;
  } catch {
    throw new AppError("Token de acesso inválido ou expirado", 401);
  }
}

/**
 * O refresh token é um valor aleatório opaco (não um JWT): só é validado
 * consultando o banco, onde guardamos apenas o hash dele.
 */
export function generateRefreshToken(): string {
  return randomBytes(64).toString("base64url");
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
