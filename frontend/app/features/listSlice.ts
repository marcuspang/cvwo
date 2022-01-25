import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { apiWithList } from "../services/list";
import { apiWithUser } from "../services/user";
import type { RootState } from "../store";
import type { TaskInterface } from "./taskSlice";
import type { UserInterface } from "./userSlice";

export interface ListInterface {
  id: number;
  title: string;
  archived: boolean;
  users: UserInterface[];
  tasks: TaskInterface[];
}

interface ListState {
  lists: ListInterface[];
}

const listInitialState: ListState = {
  lists: [],
};

// TODO refactor task reducers into task state
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
    updateListTask: (
      state,
      action: PayloadAction<{ listId: number; task: TaskInterface }>
    ) => {
      state.lists.forEach((list, listIndex) => {
        if (list.id === action.payload.listId) {
          list.tasks.forEach((task, taskIndex) => {
            if (task.id === action.payload.task.id) {
              state.lists[listIndex].tasks[taskIndex] = action.payload.task;
            }
          });
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
    builder.addMatcher(
      apiWithUser.endpoints.logout.matchFulfilled,
      (state, action) => {
        state.lists = [];
      }
    );
  },
});

export const {
  setLists,
  newListTasks,
  setListTitle,
  removeListTask,
  updateListTask,
} = list.actions;

export const selectLists = (state: RootState) => state.list.lists;
export const selectAllTasks = (state: RootState) => {
  let tasks: TaskInterface[] = [];
  state.list.lists.forEach((list) => {
    tasks = tasks.concat(list.tasks);
  });
  return tasks;
};

export default list.reducer;
