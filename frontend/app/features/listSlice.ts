import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { apiWithList } from "../services/list";
import type { RootState } from "../store";
import type { TaskInterface } from "./taskSlice";
import type { UserInterface } from "./userSlice";

export interface ListInterface {
  id: number;
  title: string;
  archived: boolean;
  users: UserInterface[];
  tasks: TaskInterface[]; // TODO update task type
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
    setList: (state, action: PayloadAction<ListInterface>) => {
      state.lists.forEach((list) => {
        if (list.id === action.payload.id) {
          list = action.payload;
        }
      });
    },
  },
  extraReducers: (builder) => {
    // update redux state with every call of getLists
    builder.addMatcher(
      apiWithList.endpoints.getLists.matchFulfilled,
      (state, action) => {
        state.lists = action.payload;
      }
    );
  },
});

export const { setLists, setList } = list.actions;

export const selectLists = (state: RootState) => state.list.lists;

export default list.reducer;
