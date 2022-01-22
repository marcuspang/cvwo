import {
  Checkbox,
  Editable,
  EditableInput,
  EditablePreview,
  FormControl,
  FormErrorMessage,
  ListIcon,
  ListItem,
  useColorModeValue,
} from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";
import type { FormInputInterface } from "../Lists/ListCard";

interface ListTaskEmptyProps {
  triggerFormSubmit: () => void;
}

const TaskEmpty = ({ triggerFormSubmit }: ListTaskEmptyProps) => {
  const { control, resetField, setValue } =
    useFormContext<FormInputInterface>();
  const editableColour = useColorModeValue("gray.400", "gray.500");
  return (
    <ListItem
      display={"flex"}
      onKeyPress={(e) => e.key === "Enter" && triggerFormSubmit()}
    >
      <ListIcon
        as={Checkbox}
        pt={2}
        lineHeight={"normal"}
        transition={"0.1s ease"}
        _hover={{
          bg: useColorModeValue("gray.100", "gray.900"),
        }}
      />
      <Controller
        name={"newTask"}
        control={control}
        rules={{
          min: { value: 1, message: "Please enter a task name" },
        }}
        defaultValue={""}
        render={({ formState, field }) => (
          <FormControl isInvalid={!!formState.errors["newTask"]}>
            <Editable
              color={editableColour}
              display={"inline-block"}
              placeholder={"enter your task"}
              value={field.value}
              w={"full"}
              onSubmit={() => {
                triggerFormSubmit();
                if (formState.isSubmitSuccessful) {
                  setValue("newTask", "");
                }
              }}
            >
              <EditablePreview />
              <EditableInput {...field} rounded={"sm"} />
            </Editable>
            {formState.errors["newTask"] && (
              <FormErrorMessage fontSize={"xs"}>
                {formState.errors["newTask"].message}
              </FormErrorMessage>
            )}
          </FormControl>
        )}
      />
    </ListItem>
  );
};

export default TaskEmpty;
