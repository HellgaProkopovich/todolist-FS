import { Navigate, useLocation } from "react-router-dom";
import type { PropsWithChildren } from "react";
import { useAppSelector } from "../app/hooks";

export default function ProtectedRoute({ children }: PropsWithChildren) {
   const access = useAppSelector((s) => s.auth.accessToken);
   const location = useLocation();

   if (!access) {
      // запоминаем, откуда нас попросили, чтобы потом вернуть
      return <Navigate to="/login" replace state={{ from: location }} />;
   }

   return <>{children}</>;
};