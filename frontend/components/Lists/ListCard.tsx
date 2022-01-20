import {
  Box,
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  FormControl,
  FormErrorMessage,
  List,
  useColorModeValue,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import {
  Controller,
  FieldErrors,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { ListInterface, newListTasks } from "../../app/features/listSlice";
import type { TaskInterface } from "../../app/features/taskSlice";
import { useUpdateListMutation } from "../../app/services/list";
import { useAddTaskMutation } from "../../app/services/task";
import { useAppDispatch } from "../../app/store";
import ListIcon from "./ListIcon";
import ListTaskEmpty from "./ListTaskEmpty";
import ListTasks from "./ListTasks";

interface ListProps {
  listData: ListInterface;
}

export interface FormInputInterface {
  title: string;
  "task-new": string;
  [taskId: string]: string;
}

const ListCard = ({ listData }: ListProps) => {
  const [updateList] = useUpdateListMutation();
  const [addTask] = useAddTaskMutation();
  // currentTitle is used to revert the title back to previous validated title
  // if error
  const [currentTitle, setCurrentTitle] = useState(listData.title);
  const form = useForm<FormInputInterface>();
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  const dispatch = useAppDispatch();

  const onSubmit: SubmitHandler<FormInputInterface> = async (values) => {
    console.log("form values", values);
    try {
      if (currentTitle !== values.title) {
        await updateList({
          id: listData.id,
          tasks: listData.tasks.map((task) => task.id),
          users: listData.users.map((user) => user.id),
          title: values.title,
        }).unwrap();
        setCurrentTitle(values.title);
      }
      if (values["task-new"]) {
        const newTaskValues = {
          dueDate: new Date().toISOString(),
          startDate: new Date().toISOString(),
          listId: listData.id,
          name: values["task-new"],
        };
        const result = await addTask(newTaskValues).unwrap();
        // update lists being displayed
        dispatch(newListTasks(result));
        form.setValue("task-new", "");
      }
    } catch (e) {
      const errorMessage = (e as FieldErrors).data.message;
      console.log("list card error", errorMessage);
      // form.setError("title", { message: errorMessage });
    }
  };

  const onError: SubmitErrorHandler<FormInputInterface> = async (errors) => {
    console.log("errors", errors);
    if (errors.title?.message) {
      form.resetField("title", {
        defaultValue: currentTitle,
      });
    }
  };

  // to manually submit the form when onSubmit happens for the 
  // list title and tasks
  const triggerFormSubmit = () => {
    submitButtonRef.current?.click();
  };

  const editableColour = useColorModeValue("gray.800", "white");
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
        <form onSubmit={form.handleSubmit(onSubmit, onError)}>
          <Controller
            name="title"
            defaultValue={currentTitle}
            control={form.control}
            rules={{ required: "Please enter a title" }}
            render={(controlProps) => (
              <FormControl isInvalid={!!controlProps.formState.errors.title}>
                <Editable
                  fontSize="lg"
                  fontWeight="bold"
                  color={editableColour}
                  value={controlProps.field.value}
                  onSubmit={triggerFormSubmit}
                >
                  <EditablePreview width={"calc(100% - 40px)"} mr={1} />
                  <EditableInput
                    {...controlProps.field}
                    rounded={"sm"}
                    width={"calc(100% - 40px)"}
                    name="title"
                    mr={1}
                  />
                  <ListIcon id={listData.id} />
                </Editable>
                {controlProps.formState.errors.title && (
                  <FormErrorMessage m={0}>
                    {controlProps.formState.errors.title.message}
                  </FormErrorMessage>
                )}
                <Button
                  hidden
                  aria-hidden
                  ref={submitButtonRef}
                  type="submit"
                />
              </FormControl>
            )}
          />
          <List mt={2}>
            {listData.tasks?.map((task: TaskInterface, key: number) => (
              <Controller
                key={key}
                name={"task-" + task.id}
                control={form.control}
                defaultValue={task.name}
                render={(controlProps) => (
                  <ListTasks
                    task={task}
                    field={controlProps.field}
                    control={form.control}
                    triggerFormSubmit={triggerFormSubmit}
                  />
                )}
              />
            ))}
            <Controller
              name={"task-new"}
              defaultValue={""}
              control={form.control}
              rules={{ required: "Please enter a task name" }}
              render={(controlProps) => (
                <ListTaskEmpty
                  field={controlProps.field}
                  control={form.control}
                  triggerFormSubmit={triggerFormSubmit}
                />
              )}
            />
          </List>
        </form>
      </Box>
    </Box>
  );
};

export default ListCard;
