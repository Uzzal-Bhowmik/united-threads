import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import cookie from "js-cookie";
export type TUser = {
  email: string;
  role: "ADMIN" | "CSR" | "CUSTOMER";
  _id: string;
  iat: number;
  exp: number;
};

type TAuthState = {
  user: null | TUser;
  token: null | string;
};

const initialState: TAuthState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      cookie.remove("token");
      cookie.remove("refreshToken");
    },
  },
});

export const { setUser, logout } = authSlice.actions;

export default authSlice.reducer;

export const selectUser = (state: RootState) => state.auth.user;
export const selectToken = (state: RootState) => state.auth.token;
