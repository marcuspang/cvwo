import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { apiWithList } from "../services/list";
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

interface LabelState {
  labels: LabelInterface[];
}

const taskInitialState: LabelState = {
  labels: [],
};

export const task = createSlice({
  name: "task",
  initialState: taskInitialState,
  reducers: {
    setTask: (state, action: PayloadAction<LabelInterface>) => {
      state.labels.forEach((task, index) => {
        if (task.id === action.payload.id) {
          state.labels[index] = action.payload;
        }
      });
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      apiWithList.endpoints.getLists.matchFulfilled,
      (state, action) => {
        
      }
    );
  },
});

// export const { setTask } = task.actions;

// export const selectTasks = (state: RootState) => state.task.tasks;
// export const selectTaskById = (id: number) =>
//   createSelector(selectTasks, (state) => state);

// export default task.reducer;
