import { emptySplitApi } from ".";
import type { LabelInterface } from "../features/labelSlice";

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
        archived,
        tasks,
        colour,
      }: LabelInterface) => ({
        url: "/label/" + id,
        method: "PATCH",
        body: { name, archived, tasks, colour },
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
