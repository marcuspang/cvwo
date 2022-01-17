import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { apiWithUser } from "../../app/services/user";
import type { RootState } from "../../app/store";

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
    // incrementByAmount: (state, action: PayloadAction<number>) => {},
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      apiWithUser.endpoints.login.matchFulfilled,
      (state, action) => {
        state.token = action.payload.token;
      }
    );
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
