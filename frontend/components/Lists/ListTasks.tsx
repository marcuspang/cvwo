import {
  Checkbox,
  CloseButton,
  Editable,
  EditableInput,
  EditablePreview,
  FormControl,
  ListIcon,
  ListItem,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  Control,
  ControllerRenderProps,
  FieldValues,
  useController,
  useFormContext,
} from "react-hook-form";
import type { TaskInterface } from "../../app/features/taskSlice";
import type { FormInputInterface } from "./ListCard";

interface ListTasksProps {
  task: TaskInterface;
  field: ControllerRenderProps<FormInputInterface, string>;
  control: Control<FormInputInterface, object>;
  triggerFormSubmit: () => Promise<boolean>;
}

const ListTasks = ({
  task,
  field,
  control,
  triggerFormSubmit,
}: ListTasksProps) => {
  const formControl = useController({
    name: field.name,
    control,
  });

  const submitHandler = () => {
    console.log("pressed");
  };

  return (
    <ListItem
      display={"flex"}
      alignItems={"center"}
      onKeyPress={(e) => e.key === "Enter" && submitHandler()}
    >
      <ListIcon
        as={Checkbox}
        lineHeight={"normal"}
        transition={"0.1s ease"}
        _hover={{
          bg: useColorModeValue("gray.100", "gray.900"),
        }}
      />
      <FormControl
        isInvalid={!!formControl.formState.errors["task-" + task.id]}
      >
        <Editable
          color={useColorModeValue("gray.600", "gray.300")} // _placeholder props don't work
          defaultValue={task.name}
          display={"inline-block"}
          placeholder={"enter your task"}
          w={"full"}
          onSubmit={async () => {
            triggerFormSubmit();
          }}
        >
          <EditablePreview />
          <EditableInput {...field} rounded={"sm"} />
        </Editable>
      </FormControl>
      <CloseButton />
    </ListItem>
  );
};

export default ListTasks;
