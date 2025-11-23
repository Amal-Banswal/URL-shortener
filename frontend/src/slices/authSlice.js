import { createSlice } from "@reduxjs/toolkit";

const token = localStorage.getItem("token") || null;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token,
    user: null,
  },
  reducers: {
    setAuth(state, action) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      localStorage.setItem("token", action.payload.token);
    },
    logout(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
    },
  },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;