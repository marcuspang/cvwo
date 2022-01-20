import {
  Checkbox,
  Editable,
  EditableInput,
  EditablePreview,
  FormControl,
  ListIcon,
  ListItem,
  useColorModeValue,
} from "@chakra-ui/react";
import type {
  Control,
  ControllerFieldState,
  ControllerRenderProps,
  UseFormStateReturn,
} from "react-hook-form";
import type { TaskInterface } from "../../app/features/taskSlice";
import type { FormInputInterface } from "../Lists/ListCard";
import TaskItemMenu from "./TaskItemMenu";

interface ListTasksProps {
  task: TaskInterface;
  field: ControllerRenderProps<
    FormInputInterface,
    `existingTask.${number}.name`
  >;
  fieldState: ControllerFieldState;
  formState: UseFormStateReturn<FormInputInterface>;
  triggerFormSubmit: () => void;
}

const TaskItem = ({
  task,
  field,
  fieldState,
  formState,
  triggerFormSubmit,
}: ListTasksProps) => {
  return (
    <ListItem
      display={"flex"}
      alignItems={"center"}
      pb={1}
      onKeyPress={(e) => e.key === "Enter" && triggerFormSubmit()}
    >
      <ListIcon
        as={Checkbox}
        lineHeight={"normal"}
        transition={"0.1s ease"}
        _hover={{
          bg: useColorModeValue("gray.100", "gray.900"),
        }}
      />
      <FormControl isInvalid={!!formState.errors.existingTask}>
        <Editable
          color={useColorModeValue("gray.600", "gray.300")}
          defaultValue={task.name}
          placeholder={"enter your task"}
          w={"calc(100% - 5px)"}
          onSubmit={triggerFormSubmit}
        >
          <EditablePreview />
          <EditableInput {...field} rounded={"sm"} />
        </Editable>
      </FormControl>
      <TaskItemMenu taskId={task.id} listId={task.listId} />
    </ListItem>
  );
};

export default TaskItem;
