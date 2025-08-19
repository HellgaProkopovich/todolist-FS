import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth"
import { prisma } from "./db"; // импортируем prisma-клиент

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

// базовые мидлвары
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// В server/src/index.ts временно добавь (ниже app.use(express.json()), но до app.listen):
// app.post("/echo-root", (req, res) => {
//   console.log("[ROOT] hit /echo-root body:", req.body);
//   res.json({ from: "root", got: req.body });
// });

app.use("/auth", authRoutes);

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
