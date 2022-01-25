import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { apiWithLabel } from "../services/label";
import { apiWithList } from "../services/list";
import type { RootState } from "../store";
import type { TaskInterface } from "./taskSlice";

export interface LabelInterface {
  id: number;
  name: string;
  startDate: string; // ISO format
  dueDate: string; // ISO format
  archived: boolean;
  tasks: TaskInterface[];
  userId: number;
}

interface LabelState {
  labels: LabelInterface[];
}

const labelInitialState: LabelState = {
  labels: [],
};

export const label = createSlice({
  name: "task",
  initialState: labelInitialState,
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
      apiWithLabel.endpoints.getLabels.matchFulfilled,
      (state, action: PayloadAction<LabelInterface[]>) => {
        state.labels = action.payload;
        console.log(action.payload);
      }
    );
  },
});

export const { setTask } = label.actions;

export const selectLabels = (state: RootState) => state.label.labels;
export const selectLabelsByTaskId = (taskId: number) =>
  createSelector(selectLabels, (state) =>
    state.map(
      (label) => label.tasks && label.tasks.filter((task) => task.id === taskId)
    )
  );

export default label.reducer;
