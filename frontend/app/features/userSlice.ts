import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { apiWithUser } from "../services/user";
import type { RootState } from "../store";

export interface User {
  username: string;
  email: string;
}

interface UserState {
  user: User;
  token: string;
}

export const userInitialState: UserState = {
  user: {
    username: "",
    email: "",
  },
  token: "",
};

export const user = createSlice({
  name: "user",
  initialState: userInitialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
  },
  extraReducers: (builder) => {
    // since every refresh calls current user, this will ensure
    // that redux knows whether the user is logged in
    builder.addMatcher(
      apiWithUser.endpoints.getCurrentUser.matchFulfilled,
      (state, action) => {
        const { username, email } = action.payload;
        state.user = { username, email };
      }
    );
  },
});

export const { setCredentials } = user.actions;

export const selectUser = (state: RootState) => state.user.user;
export const selectToken = (state: RootState) => state.user.token;

export default user.reducer;
