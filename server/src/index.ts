import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import todoRoutes from "./routes/todos";
import { prisma } from "./db";

const app = express();
// const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const PORT = Number(process.env.PORT) || 4000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://127.0.0.1:5173";

// базовые мидлвары
app.use(cors({
      origin: CORS_ORIGIN,
      credentials: false,
      methods: ["GET","POST","PUT","DELETE","OPTIONS"],
      allowedHeaders: ["Content-Type","Authorization"],
   })
);
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/todos", todoRoutes);

// health-check
app.get("/health", (_req, res) => {
   res.json({ ok: true });
});

// временный эндпоинт для проверки подключения к БД
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
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
   console.error("Global error handler:", err?.message || err);
   res.status(400).json({ error: "bad request" });
});

// graceful shutdown
process.on("SIGINT", async () => {
   await prisma.$disconnect();
   process.exit(0);
});
process.on("SIGTERM", async () => {
   await prisma.$disconnect();
   process.exit(0);
});

// запуск
app.listen(PORT, () => {
   console.log(`Server listening on http://localhost:${PORT}`);
});