import { createApi } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { AxiosError, AxiosRequestConfig } from "axios";
import { apiClient } from "./axios";

// general adaptor
const axiosBaseQuery = 
   (): BaseQueryFn<
      { url: string; method?: AxiosRequestConfig["method"]; data?: unknown; params?: unknown },
      unknown,
      unknown
   > =>
   async ({ url, method = "GET", data, params }) => {
      try {
         const result = await apiClient({ url, method, data, params });
         return { data: result.data }
      } catch (axiosError) {
         const err = axiosError as AxiosError<unknown>;
         return {
            error: {
               status: err.response?.status,
               data: err.response?.data || err.message,
            },
         };
      };
   };

export type Todo = { id: number; title: string; completed: boolean; createdAt: string; userId: number };

export const api = createApi({
   reducerPath: "api",
   baseQuery: axiosBaseQuery(),
   endpoints: (builder) => ({
      register: builder.mutation<{ message: string; userId: number }, { username: string, password: string }>({
         query: (body) => ({ url: "/auth/register", method: "POST", data: body }),
      }),
      login: builder.mutation<{ accessToken: string; refreshToken: string }, { username: string; password: string }>({
         query: (body) => ({ url: "/auth/login", method: "POST", data: body }),
      }),
      me: builder.query<{ user: { userId: number; username: string } }, void>({
         query: () => ({ url: "/auth/me" }),
      }),
      getTodos: builder.query<Todo[], void>({
         query: () => ({ url: "/todos" }),
      }),
      addTodo: builder.mutation<Todo, { title: string }>({
         query: (body) => ({ url: "/todos", method: "POST", data: body }),
      }),
      updateTodo: builder.mutation<Todo, { id: number; title?: string; completed?: boolean }>({
         query: ({ id, ...data }) => ({ url: `/todos/${id}`, method: "PUT", data }),
      }),
      deleteTodo: builder.mutation<void, { id: number }>({
         query: ({ id }) => ({ url: `/todos/${id}`, method: "DELETE" }),
      }),
   }),
});

export const {
   useRegisterMutation,
   useLoginMutation,
   useMeQuery,        // если нужен автозапрос
   useLazyMeQuery,    // если надо вызвать вручную после логина
   useGetTodosQuery,
   useAddTodoMutation,
   useUpdateTodoMutation,
   useDeleteTodoMutation,
} = api;