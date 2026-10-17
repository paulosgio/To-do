import { z } from "zod";

const email = z
  .string()
  .trim()
  .toLowerCase()
  .max(254, "E-mail muito longo")
  .pipe(z.email("E-mail inválido"));

export const registerSchema = z.object({
  name: z.string().trim().min(2, "O nome deve ter ao menos 2 caracteres").max(80, "Nome muito longo"),
  email,
  // bcrypt ignora tudo além de 72 bytes, então limitamos explicitamente.
  password: z
    .string()
    .min(8, "A senha deve ter ao menos 8 caracteres")
    .max(72, "A senha deve ter no máximo 72 caracteres"),
});

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Informe a senha").max(72),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
