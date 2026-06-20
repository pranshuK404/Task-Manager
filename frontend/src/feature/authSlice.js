import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    loginSuccess: (state, action) => {
      const { user } = action.payload;
      if (user) {
        state.user = user;
        state.isAuthenticated = true;
        state.isLoading = false;
      }
    },
    logoutSuccess: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
    stopLoading: (state) => {
      state.isLoading = false;
    },
  },
});

export const { loginSuccess, logoutSuccess, stopLoading } = authSlice.actions;
const authReducer = authSlice.reducer;
export default authReducer;
