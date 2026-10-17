import bcrypt from "bcrypt";
import { env } from "../configs/env.js";
import type { LoginInput, RegisterInput } from "../dtos/auth.dto.js";
import { AppError } from "../errors/AppError.js";
import { refreshTokenRepository } from "../repositories/refreshToken.repository.js";
import { userRepository, type PublicUser } from "../repositories/user.repository.js";
import { generateRefreshToken, hashToken, signAccessToken } from "../utils/tokens.js";

const BCRYPT_ROUNDS = 12;

// Usado quando o e-mail não existe, para que o tempo de resposta não revele
// quais e-mails estão cadastrados.
const DUMMY_PASSWORD_HASH = bcrypt.hashSync("senha-ficticia-para-timing", BCRYPT_ROUNDS);

export type AuthResult = {
  user: PublicUser;
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiresAt: Date;
};

function invalidSession(): AppError {
  return new AppError("Sessão expirada. Faça login novamente.", 401);
}

async function issueTokens(user: PublicUser): Promise<AuthResult> {
  const refreshToken = generateRefreshToken();
  const refreshTokenExpiresAt = new Date(Date.now() + env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);

  await refreshTokenRepository.create({
    tokenHash: hashToken(refreshToken),
    userId: user.id,
    expiresAt: refreshTokenExpiresAt,
  });

  return { user, accessToken: signAccessToken(user.id), refreshToken, refreshTokenExpiresAt };
}

export const authService = {
  async register(input: RegisterInput): Promise<AuthResult> {
    const existing = await userRepository.findByEmailWithPassword(input.email);
    if (existing) {
      throw new AppError("Este e-mail já está cadastrado", 409);
    }

    const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);
    const user = await userRepository.create({ name: input.name, email: input.email, passwordHash });
    return issueTokens(user);
  },

  async login(input: LoginInput): Promise<AuthResult> {
    const user = await userRepository.findByEmailWithPassword(input.email);
    const passwordMatches = await bcrypt.compare(input.password, user?.passwordHash ?? DUMMY_PASSWORD_HASH);

    if (!user || !passwordMatches) {
      throw new AppError("E-mail ou senha inválidos", 401);
    }

    await refreshTokenRepository.deleteExpiredForUser(user.id);
    return issueTokens({ id: user.id, name: user.name, email: user.email });
  },

  async refresh(refreshToken: string | undefined): Promise<AuthResult> {
    if (!refreshToken) {
      throw invalidSession();
    }

    const stored = await refreshTokenRepository.findByHash(hashToken(refreshToken));
    if (!stored) {
      throw invalidSession();
    }

    // Token já usado sendo reapresentado: indício de roubo. Encerra todas as sessões do usuário.
    if (stored.revokedAt) {
      await refreshTokenRepository.revokeAllForUser(stored.userId);
      throw invalidSession();
    }

    if (stored.expiresAt <= new Date()) {
      throw invalidSession();
    }

    const user = await userRepository.findById(stored.userId);
    if (!user) {
      throw invalidSession();
    }

    const nextToken = generateRefreshToken();
    const nextExpiresAt = new Date(Date.now() + env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);
    const rotated = await refreshTokenRepository.rotate(stored.id, {
      tokenHash: hashToken(nextToken),
      userId: user.id,
      expiresAt: nextExpiresAt,
    });

    // Outra requisição rotacionou este mesmo token primeiro: trata como reuso.
    if (!rotated) {
      await refreshTokenRepository.revokeAllForUser(user.id);
      throw invalidSession();
    }

    return {
      user,
      accessToken: signAccessToken(user.id),
      refreshToken: nextToken,
      refreshTokenExpiresAt: nextExpiresAt,
    };
  },

  async logout(refreshToken: string | undefined): Promise<void> {
    if (refreshToken) {
      await refreshTokenRepository.revokeByHash(hashToken(refreshToken));
    }
  },

  async getProfile(userId: string): Promise<PublicUser> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError("Usuário não encontrado", 404);
    }
    return user;
  },
};
