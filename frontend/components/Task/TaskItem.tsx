import {
  Badge,
  Checkbox,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  FormControl,
  ListIcon,
  ListItem,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";
import { selectLabelsByTaskId } from "../../app/features/labelSlice";
import type { TaskInterface } from "../../app/features/taskSlice";
import { useAppSelector } from "../../app/store";
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
  const labels = useAppSelector(selectLabelsByTaskId(task.id));

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
      <Flex gap={1}>
        {labels.slice(0, 2).map((label) => (
          <Badge key={label.id} lineHeight={"6"}>{label.name}</Badge>
        ))}
        {labels.length > 2 && <Text>...</Text>}
      </Flex>
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
