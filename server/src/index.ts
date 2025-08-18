import express from "express";
import cors from "cors";

// импортируем prisma-клиент
import { prisma } from "./db";

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

// базовые мидлвары
app.use(cors());
app.use(express.json());

// health-check
app.get("/health", (_req, res) => {
   res.json({ ok: true });
});

// новый временный эндпоинт для проверки подключения к БД
app.get("/db/health", async (_req, res) => {
   try {
      // запрос к базе: сколько сейчас пользователей
      const usersCount = await prisma.user.count();
      res.json({ db: "ok", usersCount })
   } catch (err) {
      console.error(err);
      res.status(500).json({ db: "error" })
   }
})

// запуск
app.listen(PORT, () => {
   console.log(`Server listening on http://localhost:${PORT}`);
});
