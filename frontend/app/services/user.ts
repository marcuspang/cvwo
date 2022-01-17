import { emptySplitApi } from ".";
import { User } from "../../features/user/userSlice";

interface UserCredentials extends User {
  password: string;
}

// Define our single API slice object
export const apiWithUser = emptySplitApi.injectEndpoints({
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
    logout: builder.mutation({
      query: () => ({
        url: "/user/logout",
        method: "POST",
      }),
    }),
  }),
});

// Export the auto-generated hook for the `getPosts` query endpoint
export const {
  useGetCurrentUserQuery,
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
} = apiWithUser;
