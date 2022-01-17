import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { apiWithList } from "../services/list";
import type { RootState } from "../store";

export interface ListInterface {
  id: string;
  title: string;
  archived: boolean;
  users: number[];
  tasks: any[]; // TODO update task type
}

interface ListState {
  lists: ListInterface[];
}

const listInitialState: ListState = {
  lists: [],
};

export const list = createSlice({
  name: "list",
  initialState: listInitialState,
  reducers: {
    setLists: (state, action: PayloadAction<ListInterface[]>) => {
      state.lists = action.payload;
    },
  },
  extraReducers: (builder) => {
    // since every refresh calls current user, this will ensure
    // that redux knows whether the user is logged in
    builder.addMatcher(
      apiWithList.endpoints.getLists.matchFulfilled,
      (state, action) => {
        state.lists = action.payload;
      }
    );
  },
});

export const { setLists } = list.actions;

export const selectLists = (state: RootState) => state.list.lists;

export default list.reducer;
