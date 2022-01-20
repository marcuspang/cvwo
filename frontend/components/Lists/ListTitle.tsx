import {
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  FormControl,
  FormErrorMessage,
  useColorModeValue,
} from "@chakra-ui/react";
import { forwardRef } from "react";
import type {
  ControllerFieldState,
  ControllerRenderProps,
  UseFormStateReturn,
} from "react-hook-form";
import type { FormInputInterface } from "./ListCard";
import ListIcon from "./ListIconButton";

interface ListTitleProps {
  field: ControllerRenderProps<FormInputInterface, `title`>;
  fieldState: ControllerFieldState;
  formState: UseFormStateReturn<FormInputInterface>;
  triggerFormSubmit: () => void;
  id: number;
}

const ListTitle = forwardRef<HTMLButtonElement, ListTitleProps>(
  ({ formState, field, fieldState, triggerFormSubmit, id }, ref) => {
    return (
      <FormControl isInvalid={!!formState.errors.title}>
        <Editable
          fontSize="lg"
          fontWeight="bold"
          color={useColorModeValue("gray.800", "white")}
          value={field.value}
          onSubmit={triggerFormSubmit}
        >
          <EditablePreview width={"calc(100% - 40px)"} mr={1} />
          <EditableInput
            {...field}
            rounded={"sm"}
            width={"calc(100% - 40px)"}
            name="title"
            mr={1}
          />
          <ListIcon id={id} />
        </Editable>
        {formState.errors.title && (
          <FormErrorMessage m={0}>
            {formState.errors.title.message}
          </FormErrorMessage>
        )}
        <Button hidden aria-hidden ref={ref} type="submit" />
      </FormControl>
    );
  }
);

ListTitle.displayName = "ListTitle";

export default ListTitle;
