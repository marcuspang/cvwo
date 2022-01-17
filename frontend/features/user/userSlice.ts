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

const initialState: UserState = {
  user: {
    username: "",
    email: "",
  },
  token: "",
};

export const user = createSlice({
  name: "user",
  initialState,
  reducers: {
    // incrementByAmount: (state, action: PayloadAction<number>) => {},
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
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
    builder.addMatcher(
      apiWithUser.endpoints.logout.matchFulfilled,
      (state, action) => {
        state = initialState;
        console.log("current state", state);
        console.log("action", action);
      }
    );
  },
});

export const { setToken } = user.actions;

export const selectUser = (state: RootState) => state.user.user;
export const selectToken = (state: RootState) => state.user.token;

export default user.reducer;
