import { createSlice } from "@reduxjs/toolkit";
import { apiWithList } from "../services/list";
import type { RootState } from "../store";
import type { User } from "./userSlice";

export interface List {
  id: string;
  title: string;
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
  users: User[];
  tasks: any[];
}

interface ListState {
  lists: List[];
}

const listInitialState = {
  lists: {},
};

export const list = createSlice({
  name: "list",
  initialState: listInitialState,
  reducers: {
    //     setCredentials: (
    //       state,
    //       action: PayloadAction<{ user: User; token: string }>
    //     ) => {
    //       state.user = action.payload.user;
    //       state.token = action.payload.token;
    //     },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      apiWithList.endpoints.getLists.matchFulfilled,
      (state, action) => {
        state.lists = action.payload;
      }
    );
  },
});

export const {} = list.actions;

export const selectUser = (state: RootState) => state.user.user;
export const selectToken = (state: RootState) => state.user.token;

export default list.reducer;
