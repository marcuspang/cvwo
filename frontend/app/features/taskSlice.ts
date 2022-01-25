import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { LabelInterface } from "./labelSlice";

export interface TaskInterface {
  id: number;
  name: string;
  startDate: string; // ISO format
  dueDate: string; // ISO format
  done: boolean;
  labels: number[];
  listId: number;
  deleted: boolean;
}
export interface TaskQueryInterface {
  id: number;
  name: string;
  startDate: string; // ISO format
  dueDate: string; // ISO format
  done: boolean;
  labels: LabelInterface[];
  listId: number;
  deleted: boolean;
}
