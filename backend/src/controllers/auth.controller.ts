import type { Request, Response } from "express";
import { loginSchema, registerSchema } from "../dtos/auth.dto.js";
import { getUserId } from "../middlewares/authenticate.js";
import { authService, type AuthResult } from "../services/auth.service.js";
import { clearRefreshCookie, readRefreshCookie, setRefreshCookie } from "../utils/cookies.js";

// O refresh token vai só no cookie httpOnly; o corpo leva o access token e o usuário.
function sendSession(res: Response, status: number, result: AuthResult): void {
  setRefreshCookie(res, result.refreshToken, result.refreshTokenExpiresAt);
  res.status(status).json({ user: result.user, accessToken: result.accessToken });
}

export const authController = {
  async register(req: Request, res: Response) {
    const input = registerSchema.parse(req.body);
    sendSession(res, 201, await authService.register(input));
  },

  async login(req: Request, res: Response) {
    const input = loginSchema.parse(req.body);
    sendSession(res, 200, await authService.login(input));
  },

  async refresh(req: Request, res: Response) {
    try {
      sendSession(res, 200, await authService.refresh(readRefreshCookie(req)));
    } catch (error) {
      clearRefreshCookie(res);
      throw error;
    }
  },

  async logout(req: Request, res: Response) {
    await authService.logout(readRefreshCookie(req));
    clearRefreshCookie(res);
    res.status(204).end();
  },

  async me(req: Request, res: Response) {
    res.json({ user: await authService.getProfile(getUserId(req)) });
  },
};
