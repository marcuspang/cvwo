import { emptySplitApi } from ".";

export const apiWithList = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    getLists: builder.query({
      query: () => "/list",
      providesTags: ["List"],
    }),
    addList: builder.mutation({
      query: (body: { title: string }) => ({
        url: "/list",
        method: "POST",
        body,
      }),
      invalidatesTags: ["List"],
    }),
    archiveList: builder.mutation({
      query: ({ id, archive }: { id: number; archive: boolean }) => ({
        url: "/list/" + id + "/archive",
        method: "PUT",
        body: { archive },
      }),
      invalidatesTags: ["List"],
    }),
    updateList: builder.mutation({
      query: ({
        id,
        title,
        tasks,
        users,
      }: {
        id: number;
        title: string;
        tasks: number[]; // id of tasks
        users: number[]; // id of users
      }) => ({
        url: "/list/" + id,
        method: "PATCH",
        body: { id, title, tasks, users },
      }),
      invalidatesTags: ["List"],
    }),
    deleteList: builder.mutation({
      query: (id: number) => ({
        url: "/list/" + id,
        method: "DELETE",
      }),
      invalidatesTags: ["List"],
    }),
  }),
});

export const {
  useAddListMutation,
  useArchiveListMutation,
  useDeleteListMutation,
  useGetListsQuery,
  useUpdateListMutation,
} = apiWithList;
