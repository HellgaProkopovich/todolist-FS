import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../db";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { requireAuth, type AuthRequest } from "../middleware/auth";

const router = Router();

// REGISTRATION
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "username and password required" });
    };

    // проверяем, что пользователя ещё нет
    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) {
      return res.status(409).json({ error: "user already exists" });
    };

    // хэшируем пароль
    const passwordHash = await bcrypt.hash(password, 10);

    // создаём пользователя
    const user = await prisma.user.create({ data: { username, passwordHash } });
    return res.json({ message: "user created", userId: user.id });
  } catch (err) {
      console.error("register error:", err);
      return res.status(500).json({ error: "internal error" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "username and password required" });
    };

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: "invalid username" });
    };

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "invalid password" });
    };

    // генерируем токены
    const accessToken = generateAccessToken(user.id, user.username);
    const refreshToken = generateRefreshToken(user.id, user.username);

    // удаляем предыдущие токены пользователя = То есть «1 refresh токен на пользователя»
    await prisma.token.deleteMany({ where: { userId: user.id } });

    // сохраняем refresh в БД
    await prisma.token.create({ data: { userId: user.id, refreshToken } });
    return res.json({ accessToken, refreshToken });
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ error: "internal error" });
  }
});

// TOKEN REFRESH
router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: "refreshToken required" });
    };

    // проверяем, есть ли такой токен в БД
    const stored = await prisma.token.findUnique({ where: { refreshToken } });
    if (!stored) {
      return res.status(401).json({ error: "invalid refresh token" });
    };

    const payload = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || "refresh_secret"
    ) as { userId: number; username: string };

    const newAccessToken = generateAccessToken(payload.userId, payload.username);
    const newRefreshToken = generateRefreshToken(payload.userId, payload.username);

    // обновляем refresh в БД (удаляем старый и добавляем новый)
    await prisma.token.delete({ where: { refreshToken } });
    await prisma.token.create({ data: { userId: payload.userId, refreshToken: newRefreshToken } });

    return res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (err) {
    console.error("refresh error:", err);
    return res.status(401).json({ error: "invalid refresh token" });
  };
});

// защищённый маршрут "кто я" (временный маршрут)
router.get("/me", requireAuth, (req: AuthRequest, res) => {
  res.json({ user: req.user });
});

export default router;