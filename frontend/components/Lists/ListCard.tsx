import {
  Box,
  Editable,
  EditableInput,
  EditablePreview,
  FormControl,
  FormErrorMessage,
  List,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  Controller,
  FieldErrors,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import type { ListInterface } from "../../app/features/listSlice";
import type { TaskInterface } from "../../app/features/taskSlice";
import { useUpdateListMutation } from "../../app/services/list";
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
  const [currentTitle, setCurrentTitle] = useState(listData.title);
  const form = useForm<FormInputInterface>();

  const onSubmit: SubmitHandler<FormInputInterface> = async (values) => {
    console.log("submitted");
    console.log(values);
    // try {
    //   await updateList({
    //     id: listData.id,
    //     tasks: listData.tasks.map((task) => task.id),
    //     users: listData.users.map((user) => user.id),
    //     title: values.title,
    //   });
    // } catch (e) {
    //   const errorMessage = (e as FieldErrors).data.message;
    //   form.setError("title", { message: errorMessage });
    // }
  };

  const triggerFormSubmit = () => {
    console.log("trigger");
    return form.trigger();
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
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Controller
            name="title"
            defaultValue={currentTitle}
            control={form.control}
            rules={{ required: true }}
            render={(controlProps) => (
              <FormControl isInvalid={!!controlProps.formState.errors.title}>
                <Editable
                  fontSize="lg"
                  fontWeight="bold"
                  color={editableColour}
                  value={controlProps.field.value}
                  onSubmit={async () => {
                    // perform validation
                    const success = await triggerFormSubmit();
                    // reset form if fails, else set previous title to current value
                    if (!success) {
                      form.reset();
                      form.setError("title", {
                        message: "Please enter a title",
                      });
                    } else {
                      setCurrentTitle(controlProps.field.value);
                    }
                  }}
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
