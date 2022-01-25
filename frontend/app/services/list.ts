import { emptySplitApi } from ".";
import type { ListInterface } from "../features/listSlice";

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
      invalidatesTags: ["List"], // TODO use dispatch instead in onQueryStarted
    }),
    archiveList: builder.mutation({
      query: ({ id, archive }: { id: number; archive: boolean }) => ({
        url: "/list/" + id + "/archive",
        method: "PUT",
        body: { archive },
      }),
      invalidatesTags: ["List"], // TODO use dispatch instead in onQueryStarted
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
        tasks: number[];
        users: number[];
      }) => ({
        url: "/list/" + id,
        method: "PATCH",
        body: { id, title, tasks, users },
      }),
      invalidatesTags: ["List"], // TODO use dispatch instead in onQueryStarted
    }),
    deleteList: builder.mutation({
      query: (id: number) => ({
        url: "/list/" + id,
        method: "DELETE",
      }),
      invalidatesTags: ["List"], // TODO use dispatch instead in onQueryStarted
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
