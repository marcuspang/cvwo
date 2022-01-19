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
import {
  Control,
  ControllerRenderProps,
  useController,
  useFormContext,
} from "react-hook-form";
import type { FormInputInterface } from "./ListCard";

interface ListTaskEmptyProps {
  field: ControllerRenderProps<FormInputInterface, "task-new">;
  control: Control<FormInputInterface, object>;
  triggerFormSubmit: () => Promise<boolean>;
}

const ListTaskEmpty = ({
  field,
  control,
  triggerFormSubmit,
}: ListTaskEmptyProps) => {
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
      <FormControl isInvalid={!!formControl.formState.errors["task-new"]}>
        <Editable
          color={useColorModeValue("gray.400", "gray.500")}
          defaultValue={""}
          display={"inline-block"}
          placeholder={"enter your task"}
          w={"full"}
          onSubmit={async () => {
            console.log("submit");
            console.log(formControl)
            triggerFormSubmit();
          }}
        >
          <EditablePreview />
          <EditableInput {...field} rounded={"sm"} />
        </Editable>
      </FormControl>
    </ListItem>
  );
};

export default ListTaskEmpty;
