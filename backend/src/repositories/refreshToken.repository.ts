import { prisma } from "../configs/prisma.js";

type NewRefreshToken = { tokenHash: string; userId: string; expiresAt: Date };

export const refreshTokenRepository = {
  create(data: NewRefreshToken) {
    return prisma.refreshToken.create({ data });
  },

  findByHash(tokenHash: string) {
    return prisma.refreshToken.findUnique({ where: { tokenHash } });
  },

  /**
   * Revoga o token atual e cria o substituto numa transação.
   * A revogação é condicional (`revokedAt: null`): se duas requisições usarem o
   * mesmo token ao mesmo tempo, só uma vence e a outra recebe `null`.
   */
  rotate(currentId: string, next: NewRefreshToken) {
    return prisma.$transaction(async (tx) => {
      const revoked = await tx.refreshToken.updateMany({
        where: { id: currentId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
      if (revoked.count === 0) {
        return null;
      }

      const created = await tx.refreshToken.create({ data: next });
      await tx.refreshToken.update({ where: { id: currentId }, data: { replacedById: created.id } });
      return created;
    });
  },

  revokeByHash(tokenHash: string) {
    return prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  },

  revokeAllForUser(userId: string) {
    return prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  },

  deleteExpiredForUser(userId: string) {
    return prisma.refreshToken.deleteMany({ where: { userId, expiresAt: { lt: new Date() } } });
  },
};
