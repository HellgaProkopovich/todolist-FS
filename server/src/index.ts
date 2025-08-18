import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

// базовые мидлвары
app.use(cors());
app.use(express.json());

// health-check
app.get("/health", (_req, res) => {
   res.json({ ok: true });
});

// запуск
app.listen(PORT, () => {
   console.log(`Server listening on http://localhost:${PORT}`);
});
