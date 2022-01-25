import { createSelector, createSlice } from "@reduxjs/toolkit";
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
  reducers: {},
  extraReducers: (builder) => {},
});

// export const {  } = task.actions;

export const selectTasks = (state: RootState) => state.task.tasks;
export const selectTaskById = (id: number) =>
  createSelector(selectTasks, (state) => state);

export default task.reducer;
