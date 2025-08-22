import axios from "axios";
import { authActions } from "../features/auth/authSlice";

// instead of import store
async function getStore() {
   const mod = await import("../app/store");
   return mod.store;
}

export const apiClient = axios.create({
   baseURL: import.meta.env.VITE_API_URL,
   withCredentials: false,
});

let refreshPromise: Promise<string> | null = null; // хранит новый access пока рефреш идёт

// ➝ добавляем токен к каждому запросу
apiClient.interceptors.request.use(async (config) => {
   const store = await getStore();
   const access = store.getState().auth.accessToken;
   if (access) config.headers.Authorization = `Bearer ${access}`;
   return config;
});

// ➝ ловим ответы с ошибкой
apiClient.interceptors.response.use(
   (res) => res,
   async (error) => {
      const original = error.config;
      const is401 = error?.response?.status === 401;
      const tried = original?._retry; // ставим флаг, чтобы не зациклиться

      if (is401 && !tried) {
         original._retry = true;
         const store = await getStore();
         const refreshToken = store.getState().auth.refreshToken;

         if (!refreshToken) {
            store.dispatch(authActions.logout());
            return Promise.reject(error);
         };

         // если рефреш уже идёт — ждём его, ждем общий promise
         if (!refreshPromise) {
            refreshPromise = (async () => {
               try {
                  // запрос на /auth/refresh, получить новый access/refresh
                  const resp = await axios.post(
                     `${import.meta.env.VITE_API_URL}/auth/refresh`,
                     { refreshToken },
                     { headers: { "Content-Type": "application/json" } }
                  );

                  const { accessToken, refreshToken: newRefresh } = resp.data;

                  // сохраняем новые токены в redux + localStorage
                  store.dispatch(authActions.setTokens({ accessToken, refreshToken: newRefresh }));

                  // вернуть новый access
                  return accessToken;
               } catch (err) {
                  console.error("refresh failed", err);
                  store.dispatch(authActions.logout());
               } finally {
                  refreshPromise = null; // сбрасываем
               };
            })();
         };

         const newAccess = await refreshPromise;  // дождались обновления токена
         original.headers.Authorization = `Bearer ${newAccess}`;
         return apiClient.request(original); // повторяем исходный запрос
      };

      return Promise.reject(error);
   }
);