import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

export const emptySplitApi = createApi({
  reducerPath: "api",
  tagTypes: ["User", "List", "Label"],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.BACKEND_URL,
    credentials: "include",
  }),
  endpoints: () => ({}),
});
