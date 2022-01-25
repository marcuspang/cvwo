import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { apiWithLabel } from "../services/label";
import { apiWithList } from "../services/list";
import type { RootState } from "../store";
import type { TaskInterface } from "./taskSlice";

export interface LabelInterface {
  id: number;
  name: string;
  archived: boolean;
  tasks: TaskInterface[];
  userId: number;
  colour: string;
}

interface LabelState {
  labels: LabelInterface[];
}

const labelInitialState: LabelState = {
  labels: [],
};

export const label = createSlice({
  name: "label",
  initialState: labelInitialState,
  reducers: {
    addLabel: (state, action: PayloadAction<LabelInterface>) => {
      state.labels.push(action.payload);
    },
    updateTaskLabels: (
      state,
      action: PayloadAction<{ taskId: number; labelIds: number[] }>
    ) => {
      state.labels.forEach((label) => {
        if (!action.payload.labelIds.includes(label.id)) {
          label.tasks = label.tasks.filter(
            (task) => task.id !== action.payload.taskId
          );
        }
      });
    },
    updateLabel: (state, action: PayloadAction<LabelInterface>) => {
      state.labels.forEach((label, index) => {
        if (label.id === action.payload.id) {
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
      }
    );
  },
});

export const { addLabel, updateTaskLabels, updateLabel } = label.actions;

export const selectLabels = (state: RootState) => state.label.labels;
export const selectLabelsByTaskId = (taskId: number) =>
  createSelector(selectLabels, (state) => {
    let result: Omit<LabelInterface, "tasks">[] = [];
    state.forEach((label) => {
      if (
        label.tasks &&
        label.tasks.filter((task) => task.id === taskId).length
      ) {
        const { tasks, ...rest } = label;
        result = result.concat(rest);
      }
    });
    return result;
  });

export default label.reducer;
