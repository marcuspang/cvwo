import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

export interface LabelInterface {
  id: number;
  name: string;
  startDate: string; // ISO format
  dueDate: string; // ISO format
  archived: boolean;
  tasks: number[];
  userId: number;
}

// interface TaskState {
//   tasks: TaskInterface[];
// }

// const taskInitialState: TaskState = {
//   tasks: [],
// };

// export const task = createSlice({
//   name: "task",
//   initialState: taskInitialState,
//   reducers: {
//     setTask: (state, action: PayloadAction<TaskInterface>) => {
//       state.tasks.forEach((task, index) => {
//         if (task.id === action.payload.id) {
//           state.tasks[index] = action.payload;
//         }
//       });
//     },
//   },
//   extraReducers: (builder) => {},
// });

// export const { setTask } = task.actions;

// export const selectTasks = (state: RootState) => state.task.tasks;
// export const selectTaskById = (id: number) =>
//   createSelector(selectTasks, (state) => state);

// export default task.reducer;
