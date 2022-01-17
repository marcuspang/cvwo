import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { apiWithUser } from "../../app/services/user";
import type { RootState } from "../../app/store";

export interface UserState {
  username: string;
  email: string;
}

const initialState: UserState = {
  username: "",
  email: "",
};

export const user = createSlice({
  name: "user",
  initialState,
  reducers: {
    // incrementByAmount: (state, action: PayloadAction<number>) => {},
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      apiWithUser.endpoints.login.matchFulfilled,
      (state, action) => {
        console.log(action);
        state.username = action.payload.result.username;
        state.email = action.payload.result.email;
      }
    );
    builder.addMatcher(
      apiWithUser.endpoints.getCurrentUser.matchFulfilled,
      (state, _) => {
        state.username = initialState.username;
        state.email = initialState.email;
      }
    );
  },
});

// export const {  } = user.actions;

export const selectUser = (state: RootState) => state.user;

export default user.reducer;
