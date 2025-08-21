import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type User = { userId: number; username: string };
type AuthState = {
   user: User | null;
   accessToken: string | null;
   refreshToken: string | null;
};

const initialState: AuthState = (() => {
   const raw = localStorage.getItem("auth");
   return raw ? JSON.parse(raw) as AuthState : { user: null, accessToken: null, refreshToken: null };
})();

const slice = createSlice({
   name: "auth",
   initialState,
   reducers: {
      setTokens(
         state,
         action: PayloadAction<{ accessToken: string; refreshToken: string }>
      ) {
         state.accessToken = action.payload.accessToken;
         state.refreshToken = action.payload.refreshToken;
         localStorage.setItem("auth", JSON.stringify(state));
      },
      setUser(
         state,
         action: PayloadAction<User | null>
      ) {
         state.user = action.payload;
         localStorage.setItem("auth", JSON.stringify(state));
      },
      logout(state) {
         state.user = null;
         state.accessToken = null;
         state.refreshToken = null;
         localStorage.removeItem("auth");
      },
   },
});

export const authReducer = slice.reducer;
export const authActions = slice.actions;
export default authReducer;