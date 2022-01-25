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
import { Controller, useFormContext } from "react-hook-form";
import type { FormInputInterface } from "./ListCard";
import ListIcon from "./ListIconButton";

interface ListTitleProps {
  triggerFormSubmit: () => void;
  defaultValue: string;
  id: number;
}

const ListTitle = forwardRef<HTMLButtonElement, ListTitleProps>(
  ({ triggerFormSubmit, defaultValue, id }, ref) => {
    const { control } = useFormContext<FormInputInterface>();
    const titleColour = useColorModeValue("gray.800", "white");
    return (
      <Controller
        name="title"
        defaultValue={defaultValue}
        control={control}
        rules={{ required: "Please enter a title" }}
        render={({ formState, field }) => (
          <FormControl isInvalid={!!formState.errors.title}>
            <Editable
              fontSize="lg"
              fontWeight="bold"
              color={titleColour}
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
        )}
      />
    );
  }
);

ListTitle.displayName = "ListTitle";

export default ListTitle;
