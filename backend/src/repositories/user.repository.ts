import { prisma } from "../configs/prisma.js";

// Nunca devolvemos passwordHash para fora da camada de serviço de auth.
const publicUserSelect = { id: true, name: true, email: true } as const;

export type PublicUser = { id: string; name: string; email: string };

export const userRepository = {
  findByEmailWithPassword(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  findById(id: string): Promise<PublicUser | null> {
    return prisma.user.findUnique({ where: { id }, select: publicUserSelect });
  },

  create(data: { name: string; email: string; passwordHash: string }): Promise<PublicUser> {
    return prisma.user.create({ data, select: publicUserSelect });
  },
};
