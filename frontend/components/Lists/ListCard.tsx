import { Box, List, useColorModeValue } from "@chakra-ui/react";
import { DevTool } from "@hookform/devtools";
import { useRef, useState } from "react";
import {
  Controller,
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
import type { TaskInterface } from "../../app/features/taskSlice";
import { useUpdateListMutation } from "../../app/services/list";
import { useAddTaskMutation } from "../../app/services/task";
import { useAppDispatch } from "../../app/store";
import TaskEmpty from "../Task/TaskEmpty";
import TaskItem from "../Task/TaskItem";
import ListTitle from "./ListTitle";

interface ListProps {
  listData: ListInterface;
}

export interface FormInputInterface {
  title: string;
  taskNew: string;
  existingTask: { name: string }[];
}

// has one main form per list card instead of many small ones for
// each individual tasks
const ListCard = ({ listData }: ListProps) => {
  // redux hooks
  const [updateList] = useUpdateListMutation();
  const [addTask] = useAddTaskMutation();
  const dispatch = useAppDispatch();

  // currentTitle is used to revert the title back to previous
  // validated title if empty title entered
  const [currentTitle, setCurrentTitle] = useState(listData.title);
  // ref used to trigger form submission in children elements
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  // react-hook-form hooks
  const form = useForm<FormInputInterface>({
    defaultValues: {
      taskNew: "",
      existingTask: listData.tasks?.map((task) => ({ name: task.name })) || [],
    },
  });
  const { control, setValue, resetField, handleSubmit } = form;
  // field array to group array of existing tasks
  const { fields, append } = useFieldArray({
    control,
    name: "existingTask",
    keyName: "id",
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
      if (values["taskNew"]) {
        // add task to database
        const result = await addTask({
          dueDate: new Date().toISOString(),
          startDate: new Date().toISOString(),
          listId: listData.id,
          name: values["taskNew"],
        }).unwrap();
        // update list on react-hook-form
        append({ name: values["taskNew"] }); // TODO fix duplication bug
        // update lists being displayed
        dispatch(newListTasks(result));
        setValue("taskNew", "");
      }
    } catch (e) {
      console.log(e);
      // const errorMessage = (e as FieldErrors).data.message;
      // setError("title", { message: errorMessage });
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

  // to manually submit the form when onSubmit happens for the
  // list title and tasks
  const triggerFormSubmit = () => {
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
            <Controller
              name="title"
              defaultValue={currentTitle}
              control={control}
              rules={{ required: "Please enter a title" }}
              render={(controlProps) => (
                <ListTitle
                  {...controlProps}
                  id={listData.id}
                  ref={submitButtonRef}
                  triggerFormSubmit={triggerFormSubmit}
                />
              )}
            />
            <List mt={2}>
              {fields.length &&
                listData.tasks?.map((task: TaskInterface, index: number) => (
                  <Controller
                    key={fields[index].id}
                    name={`existingTask.${task.id}.name`}
                    control={control}
                    defaultValue={fields[index].name}
                    render={(controlProps) => (
                      <TaskItem
                        {...controlProps}
                        task={task}
                        triggerFormSubmit={triggerFormSubmit}
                      />
                    )}
                  />
                ))}
              <Controller
                name={"taskNew"}
                control={control}
                rules={{
                  min: { value: 1, message: "Please enter a task name" },
                }}
                render={(controlProps) => (
                  <TaskEmpty
                    {...controlProps}
                    triggerFormSubmit={triggerFormSubmit}
                  />
                )}
              />
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
