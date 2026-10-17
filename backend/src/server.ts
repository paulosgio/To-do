import { app } from "./app.js";
import { env } from "./configs/env.js";
import { prisma } from "./configs/prisma.js";

const server = app.listen(env.PORT, () => {
  console.log(`API rodando em http://localhost:${env.PORT}/api`);
});

function shutdown(signal: string) {
  console.log(`${signal} recebido, encerrando...`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
