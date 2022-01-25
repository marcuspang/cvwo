import { emptySplitApi } from ".";

export const apiWithLabel = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    getLabels: builder.query({
      query: () => "/label/current",
      providesTags: ["Label"],
    }),
    addLabel: builder.mutation({
      query: (body: { name: string; tasks: number[] }) => ({
        url: "/label",
        method: "POST",
        body,
      }),
    }),
    removeLabelFromTask: builder.mutation({
      query: ({
        taskId,
        labelId,
        remove,
      }: {
        taskId: number;
        labelId: number;
        remove: boolean;
      }) => ({
        url: "/label/" + labelId + "/" + taskId + "/remove",
        method: "PUT",
        body: { remove },
      }),
    }),
    updateLabel: builder.mutation({
      query: ({
        id,
        name,
        tasks,
      }: {
        id: number;
        name: string;
        tasks: number[]; // id of tasks
      }) => ({
        url: "/label/" + id,
        method: "PATCH",
        body: { name, tasks },
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
  useRemoveLabelFromTaskMutation,
  useUpdateLabelMutation,
} = apiWithLabel;
