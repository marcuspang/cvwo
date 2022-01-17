import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

export const emptySplitApi = createApi({
  reducerPath: "api",
  tagTypes: ["User", "List"],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
    prepareHeaders: (headers) => {
      return headers;
    },
    credentials: "include",
  }),
  endpoints: () => ({}),
});
