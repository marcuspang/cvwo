import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { stat } from "fs";
import { apiWithTask } from "../services/task";
import type { RootState } from "../store";

export interface TaskInterface {
  id: number;
  name: string;
  startDate: string; // ISO format
  dueDate: string; // ISO format
  done: boolean;
  labels: number[];
  listId: number;
}

interface TaskState {
  tasks: TaskInterface[];
}

const taskInitialState: TaskState = {
  tasks: [],
};

export const task = createSlice({
  name: "task",
  initialState: taskInitialState,
  reducers: {
    setTasks: (state, action: PayloadAction<TaskInterface[]>) => {
      state.tasks = action.payload;
    },
    newTask: (state, action: PayloadAction<TaskInterface>) => {
      state.tasks.push(action.payload);
    },
    setTask: (state, action: PayloadAction<TaskInterface>) => {
      state.tasks.forEach((task, index) => {
        if (task.id === action.payload.id) {
          state.tasks[index] = action.payload;
        }
      });
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      apiWithTask.endpoints.getTasksByListId.matchFulfilled,
      (state, action: PayloadAction<TaskInterface[]>) => {
        state.tasks = action.payload;
      }
    );
  },
});

export const { newTask, setTasks, setTask } = task.actions;

export const selectTasks = (state: RootState) => state.task.tasks;
export const selectTaskById = (id: number) =>
  createSelector(selectTasks, (state) => state);

export default task.reducer;
