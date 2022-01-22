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
import { Controller, useFormContext } from "react-hook-form";
import type { TaskInterface } from "../../app/features/taskSlice";
import type { FormInputInterface } from "../Lists/ListCard";
import TaskItemMenu from "./TaskItemMenu";

interface ListTasksProps {
  task: TaskInterface;
  index: number;
  defaultValue: string;
  triggerFormSubmit: (index?: number) => void;
  remove: () => void;
}

const TaskItem = ({
  task,
  defaultValue,
  index,
  triggerFormSubmit,
  remove,
}: ListTasksProps) => {
  const { control, setValue, getValues } = useFormContext<FormInputInterface>();
  const editableColour = useColorModeValue("gray.600", "gray.300");
  const checkboxHoverBackground = useColorModeValue("gray.100", "gray.900");

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
        isChecked={getValues(`existingTask.${index}.done`)}
        onChange={(e) => {
          setValue(`existingTask.${index}.done`, (e.target as any).checked);
          triggerFormSubmit(index);
        }}
        _hover={{
          bg: checkboxHoverBackground,
        }}
      />
      <Controller
        control={control}
        name={`existingTask.${index}.name`}
        defaultValue={defaultValue}
        render={({ formState, field }) => (
          <FormControl isInvalid={!!formState.errors.existingTask}>
            <Editable
              color={editableColour}
              defaultValue={field.value}
              placeholder={"enter your task"}
              w={"calc(100% - 5px)"}
              onSubmit={() => triggerFormSubmit(index)}
            >
              <EditablePreview />
              <EditableInput {...field} rounded={"sm"} />
            </Editable>
          </FormControl>
        )}
      />
      <TaskItemMenu
        taskId={task.id}
        listId={task.listId}
        index={index}
        remove={remove}
        triggerFormSubmit={triggerFormSubmit}
      />
    </ListItem>
  );
};

export default TaskItem;
