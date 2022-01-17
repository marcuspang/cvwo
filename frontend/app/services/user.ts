import { emptySplitApi } from ".";
import type { User } from "../features/userSlice";

interface UserCredentials extends User {
  password: string;
}

export const apiWithUser = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentUser: builder.query({
      query: () => "/user/current",
      providesTags: ["User"],
    }),
    register: builder.mutation({
      query: (user: UserCredentials) => ({
        url: "/user",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["User"],
    }),
    login: builder.mutation({
      query: (user: UserCredentials) => ({
        url: "/user/login",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["User"],
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/user/logout",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

// auto-generated hooks
export const {
  useGetCurrentUserQuery,
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
} = apiWithUser;
