import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation, useLazyMeQuery } from "../services/api";
import { useAppDispatch } from "../app/hooks";
import { authActions } from "../features/auth/authSlice";

export default function LoginPage() {
   const [username, setUsername] = useState("");
   const [password, setPassword] = useState("");
   const [login, { isLoading, error }] = useLoginMutation();
   const [fetchMe] = useLazyMeQuery();
   const dispatch = useAppDispatch();
   const navigate = useNavigate();

   const onSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
         //1 - login
         const tokens = await login({ username, password }).unwrap();
         // tokens: { accessToken, refreshToken }

         //2 - кладём токены в Redux (+ localStorage внутри slice)
         dispatch(authActions.setTokens(tokens));

         // 3) узнаём "кто я?"
         const me = await fetchMe().unwrap();
         // me: { user: { userId, username } }

         // 4) кладём пользователя
         dispatch(authActions.setUser(me.user));

         // 5) на /todos
         navigate("/todos");
      } catch (err) {
         console.error("login failed:", err);
      }
   };

   return (
      <form onSubmit={onSubmit} className="max-w-sm mx-auto space-y-3">
         <input
            className="border p-2 w-full"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
         />
         <input
            className="border p-2 w-full"
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
         />
         <button className="bg-blue-600 text-white px-4 py-2" disabled={isLoading}>
            {isLoading ? "..." : "Login"}
         </button>
         {error ? <div className="text-red-600 text-sm">Login error</div> : null}
      </form>
   );
};