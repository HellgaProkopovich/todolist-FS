import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
   user?: { userId: number; username: string };
};

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
   try {
      const auth = req.headers.authorization;
      if (!auth) {
         return res.status(401).json({ error: "unauthorized" });
      };

      // ожидаем формат: "Bearer <token>"
      const [scheme, token] = auth.split(" ");
      if (scheme !== "Bearer" || !token) {
         return res.status(401).json({ error: "unauthorized" });
      };

      // проверяем подпись и срок жизни токена
      const payload = jwt.verify(
         token,
         process.env.JWT_ACCESS_SECRET || "access_secret"
      ) as { userId: number; username: string };

      // кладём в req.user и пропускаем дальше
      req.user = { userId: payload.userId, username: payload.username };
      next();
   } catch (err) {
      // сюда попадём, если подпись невалидна или токен истёк
      console.error("access error:", err);
      return res.status(401).json({ error: "unauthorized" });
   };
};