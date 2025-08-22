import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLoginMutation, useLazyMeQuery } from "../services/api";
import { api } from "../services/api";
import { useAppDispatch } from "../app/hooks";
import { authActions } from "../features/auth/authSlice";
import { getApiErrorMessage } from "../utils/errorMessage";

export default function LoginPage() {
   const [username, setUsername] = useState("");
   const [password, setPassword] = useState("");
   const [submitted, setSubmitted] = useState(false);

   const [login, { isLoading, error }] = useLoginMutation();
   const [fetchMe] = useLazyMeQuery();
   const dispatch = useAppDispatch();
   const navigate = useNavigate();

   const uEmpty = submitted && !username.trim();
   const pEmpty = submitted && !password.trim();

   const onSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitted(true);
      if (!username.trim() || !password.trim()) return;

      try {
         //1 - login → токены tokens: { accessToken, refreshToken }
         const tokens = await login({ username, password }).unwrap();

         //2 - кладём токены в Redux (+ localStorage внутри slice)
         dispatch(authActions.setTokens(tokens));

         // 3) узнаём "кто я?" me: { user: { userId, username } }
         const me = await fetchMe().unwrap();

         // 4) кладём пользователя
         dispatch(authActions.setUser(me.user));

         // (вычищаем кэш прошлого пользователя)
         dispatch(api.util.resetApiState());

         // 5) на /todos
         navigate("/todos");
      } catch (err) {
         console.error("login failed:", err);
      }
   };

   return (
      <div className="max-w-sm mx-auto mt-8">
         <h1 className="text-6xl font-bold mb-10">Login</h1>

         <form onSubmit={onSubmit} className="grid gap-2">
            <input
               className={`border rounded px-3 py-2 ${uEmpty ? "border-red-500" : ""}`}
               placeholder="username"
               value={username}
               onChange={(e) => setUsername(e.target.value)}
               aria-invalid={uEmpty}
            />
            {uEmpty && <div className="text-red-600 text-sm">Username is required</div>}

            <input
               className={`border rounded px-3 py-2 ${pEmpty ? "border-red-500" : ""}`}
               type="password"
               placeholder="password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               aria-invalid={pEmpty}
            />
            {pEmpty && <div className="text-red-600 text-sm">Password is required</div>}

            <button
               className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 disabled:opacity-50"
               disabled={isLoading}
               type="submit">
                  {isLoading ? "..." : "Login"}
            </button>
         </form>

         {/* ошибка с бэкенда (401 invalid username/password и т.д.) */}
         {!!error && (
            <div className="text-red-600 text-sm mt-2">
               {getApiErrorMessage(error)}
            </div>
         )}

         <div className="mt-2">
            Not registered yet?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
               Register
            </Link>
         </div>
      </div>
   );
};