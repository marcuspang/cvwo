import { createSlice, PayloadAction } from "@reduxjs/toolkit";
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
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      apiWithTask.endpoints.getTasksByUserId.matchFulfilled,
      (state, action: PayloadAction<TaskInterface[]>) => {
        state.tasks = action.payload;
      }
    );
  },
});

// export const {} = task.actions;

export const selectTasks = (state: RootState) => state.task.tasks;

export default task.reducer;
