import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import todoRoutes from "./routes/todos";
import { prisma } from "./db";

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

// базовые мидлвары
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes);
app.use("/todos", todoRoutes);

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
});

// error handler на случай ошибок парсинга JSON и прочего
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
   console.error("Global error handler:", err?.message || err);
   res.status(400).json({ error: "bad request" });
});

// запуск
app.listen(PORT, () => {
   console.log(`Server listening on http://localhost:${PORT}`);
});