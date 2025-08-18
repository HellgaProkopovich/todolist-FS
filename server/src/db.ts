import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

// аккуратное закрытие соединения при остановке сервера
process.on('SIGINT', async () => {
   await prisma.$disconnect();
   process.exit(0);
});

process.on('SIGTERM', async () => {
   await prisma.$disconnect();
   process.exit(0);
});