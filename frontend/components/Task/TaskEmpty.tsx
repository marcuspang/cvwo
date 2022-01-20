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
import type {
  ControllerFieldState,
  ControllerRenderProps,
  UseFormStateReturn,
} from "react-hook-form";
import type { FormInputInterface } from "../Lists/ListCard";

interface ListTaskEmptyProps {
  field: ControllerRenderProps<FormInputInterface, "taskNew">;
  fieldState: ControllerFieldState;
  formState: UseFormStateReturn<FormInputInterface>;
  triggerFormSubmit: () => void;
}

const TaskEmpty = ({
  field,
  formState,
  fieldState,
  triggerFormSubmit,
}: ListTaskEmptyProps) => {
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
      <FormControl isInvalid={!!formState.errors["taskNew"]}>
        <Editable
          color={useColorModeValue("gray.400", "gray.500")}
          defaultValue={""}
          display={"inline-block"}
          placeholder={"enter your task"}
          w={"full"}
          onSubmit={() => {
            triggerFormSubmit();
            if (formState.isSubmitSuccessful) {
              field.value = "";
            }
          }}
        >
          <EditablePreview />
          <EditableInput {...field} rounded={"sm"} />
        </Editable>
        {formState.errors["taskNew"] && (
          <FormErrorMessage fontSize={"xs"}>
            {formState.errors["taskNew"].message}
          </FormErrorMessage>
        )}
      </FormControl>
    </ListItem>
  );
};

export default TaskEmpty;
