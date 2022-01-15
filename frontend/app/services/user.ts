import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { UserState } from "../../features/user/user";

interface UserCredentials extends UserState {
  password: string;
}

// Define our single API slice object
export const userApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
    prepareHeaders: (headers) => {
      headers.set("credentials", `include`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getCurrentUser: builder.query({
      query: () => "/user/current",
    }),
    register: builder.mutation({
      query: (user: UserCredentials) => ({
        url: "/user",
        method: "POST",
        body: user,
      }),
    }),
    login: builder.mutation({
      query: (user: UserCredentials) => ({
        url: "/user/login",
        method: "POST",
        body: user,
      }),
    }),
  }),
});

// Export the auto-generated hook for the `getPosts` query endpoint
export const { useGetCurrentUserQuery, useRegisterMutation, useLoginMutation } = userApi;
