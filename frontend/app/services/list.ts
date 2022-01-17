import { emptySplitApi } from ".";

// TODO add invalidate tags?
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
    }),
    archiveList: builder.mutation({
      query: ({ id, archive }: { id: number; archive: boolean }) => ({
        url: "/list/" + id + "/archive",
        method: "PUT",
        body: { archive },
      }),
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
        body: { title, tasks, users },
      }),
    }),
    deleteList: builder.mutation({
      query: (body: { id: number }) => ({
        url: "/list/" + body.id,
        method: "DELETE",
        body,
      }),
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
