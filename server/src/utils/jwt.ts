import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "access_secret";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refresh_secret";

// генерируем accessToken (живёт 15 мин)
export function generateAccessToken(userId: number, username: string) {
   return jwt.sign(
      { userId, username },
      ACCESS_SECRET,
      { expiresIn: "15m" }
   );
};

// генерируем refreshToken (живёт 7 дней)
export function generateRefreshToken(userId: number, username:string) {
   return jwt.sign(
      { userId, username },
      REFRESH_SECRET,
      { expiresIn: "7d" }
   );
};