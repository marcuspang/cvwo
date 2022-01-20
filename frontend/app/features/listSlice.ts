import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { apiWithList } from "../services/list";
import { apiWithTask } from "../services/task";
import type { RootState } from "../store";
import type { TaskInterface } from "./taskSlice";
import taskSlice from "./taskSlice";
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
    setListTitle: (
      state,
      action: PayloadAction<{ id: number; title: string }>
    ) => {
      state.lists.forEach((list) => {
        if (list.id === action.payload.id) {
          list.title = action.payload.title;
        }
      });
    },
    newListTasks: (state, action: PayloadAction<TaskInterface>) => {
      state.lists.forEach((list) => {
        if (list.id === action.payload.listId) {
          list.tasks.push(action.payload);
        }
      });
    },
    removeListTask: (
      state,
      action: PayloadAction<{ listId: number; taskId: number }>
    ) => {
      state.lists.forEach((list) => {
        if (list.id === action.payload.listId) {
          list.tasks = list.tasks.filter(
            (task) => task.id !== action.payload.taskId
          );
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

export const { setLists, newListTasks, setListTitle, removeListTask } =
  list.actions;

export const selectLists = (state: RootState) => state.list.lists;

export default list.reducer;
