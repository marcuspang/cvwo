import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

// Define a type for the slice state
export interface UserState {
  username: string;
  email: string;
}

// Define the initial state using that type
const initialState: UserState = {
  username: "",
  email: "",
};

export const user = createSlice({
  name: "user",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    incrementByAmount: (state, action: PayloadAction<number>) => {
    //   state.value += action.payload;
    },
  },
});

export const { incrementByAmount } = user.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectUser = (state: RootState) => state.user;

export default user.reducer;
