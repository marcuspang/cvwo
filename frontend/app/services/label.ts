import { emptySplitApi } from ".";

export const apiWithLabel = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    getLabels: builder.query({
      query: () => "/label/current",
      providesTags: ["Label"],
    }),
    addLabel: builder.mutation({
      query: (body: { name: string; tasks: number[]; colour: string }) => ({
        url: "/label",
        method: "POST",
        body,
      }),
    }),
    archiveLabel: builder.mutation({
      query: ({ labelId, archive }: { labelId: number; archive: boolean }) => ({
        url: "/label/" + labelId + "/archive",
        method: "PUT",
        body: { archive },
      }),
    }),
    updateLabel: builder.mutation({
      query: ({
        id,
        name,
        tasks,
        colour,
      }: {
        id: number;
        name: string;
        tasks: number[]; // id of tasks
        colour: string;
      }) => ({
        url: "/label/" + id,
        method: "PATCH",
        body: { name, tasks, colour },
      }),
    }),
    deleteLabel: builder.mutation({
      query: (id: number) => ({
        url: "/label/" + id,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useAddLabelMutation,
  useDeleteLabelMutation,
  useGetLabelsQuery,
  useArchiveLabelMutation,
  useUpdateLabelMutation,
} = apiWithLabel;
