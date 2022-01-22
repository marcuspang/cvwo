import { Box, List, useColorModeValue } from "@chakra-ui/react";
import { DevTool } from "@hookform/devtools";
import { useRef, useState } from "react";
import {
  Controller,
  FieldErrors,
  FormProvider,
  SubmitErrorHandler,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import {
  ListInterface,
  newListTasks,
  setListTitle,
} from "../../app/features/listSlice";
import { setTask, TaskInterface } from "../../app/features/taskSlice";
import { useUpdateListMutation } from "../../app/services/list";
import {
  useAddTaskMutation,
  useUpdateTaskMutation,
} from "../../app/services/task";
import { useAppDispatch } from "../../app/store";
import TaskEmpty from "../Task/TaskEmpty";
import TaskItem from "../Task/TaskItem";
import ListTitle from "./ListTitle";

interface ListProps {
  listData: ListInterface;
}

export interface FormInputInterface {
  title: string;
  newTask: string;
  updatingTaskId: number;
  existingTask: TaskInterface[];
}

// has one main form per list card instead of many small ones for
// each individual tasks
const ListCard = ({ listData }: ListProps) => {
  // redux hooks
  const [updateList] = useUpdateListMutation();
  const [addTask] = useAddTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const dispatch = useAppDispatch();

  // currentTitle is used to revert the title back to previous
  // validated title if empty title entered
  const [currentTitle, setCurrentTitle] = useState(listData.title);

  const [updatingTaskIndex, setUpdatingTaskIndex] = useState(-1);
  // ref used to trigger form submission in children elements
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  // react-hook-form hooks
  const form = useForm<FormInputInterface>({
    defaultValues: {
      newTask: "",
      updatingTaskId: -1,
      existingTask: listData.tasks || [],
    },
  });
  const { control, setValue, resetField, handleSubmit, setError } = form;
  // field array to group array of existing tasks
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "existingTask",
    keyName: "key",
  });

  const onSubmit: SubmitHandler<FormInputInterface> = async (values) => {
    console.log("form values", values);
    try {
      // check if title changed
      if (currentTitle !== values.title) {
        await updateList({
          id: listData.id,
          tasks: listData.tasks.map((task) => task.id),
          users: listData.users.map((user) => user.id),
          title: values.title,
        }).unwrap();
        dispatch(setListTitle({ id: listData.id, title: values.title }));
        setCurrentTitle(values.title);
      }

      // check if there's a new task
      if (values.newTask.length) {
        // add task to database
        const result = await addTask({
          dueDate: new Date().toISOString(),
          startDate: new Date().toISOString(),
          listId: listData.id,
          name: values.newTask,
        }).unwrap();
        // update list on react-hook-form so that the form can submit requests on new task
        append({ ...result });
        // update lists on redux (display)
        dispatch(newListTasks(result));
        setValue("newTask", "");
      }

      // check if updatingTaskId exists and update the specific task
      // need 0 as 0 is falsy
      if (values.updatingTaskId >= 0) {
        const result = await updateTask({
          ...values.existingTask[values.updatingTaskId],
        }).unwrap();
        setValue("updatingTaskId", -1);
        console.log(result);
        update(values.updatingTaskId, { ...result });
        dispatch(setTask(result));
      }
    } catch (e) {
      const errorMessage = (e as FieldErrors).data.message;
      if (errorMessage) {
        if (errorMessage.includes("title")) {
          setError("title", { message: errorMessage });
        } else if (errorMessage.includes("task")) {
          setError("newTask", { message: errorMessage });
        }
      }
    }
  };

  // errors from validating the fields on frontend
  // TODO add same validation for backend?
  const onError: SubmitErrorHandler<FormInputInterface> = async (errors) => {
    console.log("errors", errors);
    if (errors.title?.message) {
      resetField("title", {
        defaultValue: currentTitle,
      });
    }
  };

  // to manually submit the form when onSubmit happens for the list title and tasks
  const triggerFormSubmit = async (index?: number) => {
    // as 0 returns false, need to check whether its defined instead
    if (typeof index !== "undefined" && index >= 0)
      setValue("updatingTaskId", index);
    submitButtonRef.current?.click();
  };

  return (
    <Box w={"sm"} pl={4} display={"inline-flex"}>
      <Box
        w="full"
        mx="auto"
        px={4}
        py={3}
        bg={useColorModeValue("white", "gray.700")}
        shadow="md"
        rounded="md"
      >
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit, onError)}>
            <ListTitle
              defaultValue={currentTitle}
              id={listData.id}
              ref={submitButtonRef}
              triggerFormSubmit={triggerFormSubmit}
            />
            <List mt={2}>
              {fields.length &&
                listData.tasks?.map((task: TaskInterface, index: number) => (
                  <TaskItem
                    key={fields[index].key}
                    task={task}
                    index={index}
                    defaultValue={task.name}
                    triggerFormSubmit={triggerFormSubmit}
                    remove={() => remove(index)}
                  />
                ))}
              <TaskEmpty triggerFormSubmit={triggerFormSubmit} />
            </List>
            <DevTool control={control} />
            {/* set up the dev tool for last task list*/}
          </form>
        </FormProvider>
      </Box>
    </Box>
  );
};

export default ListCard;
