import { emptySplitApi } from ".";
import type { TaskInterface } from "../features/taskSlice";

export const apiWithTask = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    getTasksByUserId: builder.query({
      query: (userId: number) => "/task?listId=" + userId,
    }),
    getTaskById: builder.query({
      query: (id: number) => "/task/" + id,
    }),
    addTask: builder.mutation({
      query: (body: Omit<TaskInterface, "id" | "done" | "labels">) => ({
        url: "/task",
        method: "POST",
        body,
      }),
    }),
    updateTask: builder.mutation({
      query: (body: TaskInterface) => ({
        url: "/task/" + body.id,
        method: "PATCH",
        body: {
          name: body.name,
          startDate: body.startDate,
          dueDate: body.dueDate,
          done: body.done,
          labels: body.labels,
          listId: body.listId,
        },
      }),
    }),
    deleteTask: builder.mutation({
      query: (id: number) => ({
        url: "/task/" + id,
        method: "DELETE",
      }),
    }),
    archiveTask: builder.mutation({
      query: ({ id, archive }: { id: number; archive: boolean }) => ({
        url: "/list/" + id + "/archive",
        method: "PUT",
        body: { archive },
      }),
    }),
  }),
});

export const {
  useAddTaskMutation,
  useArchiveTaskMutation,
  useDeleteTaskMutation,
  useGetTaskByIdQuery,
  useGetTasksByUserIdQuery,
  useUpdateTaskMutation,
} = apiWithTask;
