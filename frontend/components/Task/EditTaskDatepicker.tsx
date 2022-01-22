import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
} from "@chakra-ui/react";
import { Control, Controller } from "react-hook-form";
import type { FormInputInterface } from "../Lists/ListCard";
import Datepicker from "react-datepicker";

interface EditTaskDatepickerProps {
  fieldName: "startDate" | "dueDate";
  title: string;
  index: number;
  control: Control<FormInputInterface, object>;
}

// TODO add check for due date to be after start date
const EditTaskDatepicker = ({
  index,
  control,
  title,
  fieldName,
}: EditTaskDatepickerProps) => {
  return (
    <Controller
      name={`existingTask.${index}.${fieldName}`}
      rules={{
        required: "Please enter a valid date",
      }}
      control={control}
      render={({ formState, field }) => (
        <FormControl isInvalid={!!formState.errors.existingTask} mb={2}>
          <FormLabel htmlFor={fieldName}>{title}</FormLabel>
          <Input
            as={Datepicker}
            showTimeInput
            name={fieldName}
            showTimeSelect
            timeIntervals={1}
            // disable past dates for dueDate
            minDate={fieldName === "dueDate" ? new Date() : undefined}
            // disable past times (except the current minute) for dueDate
            filterTime={
              fieldName === "dueDate"
                ? (time: Date) => {
                    return (
                      new Date().getTime() < new Date(time).getTime() + 60000
                    );
                  }
                : undefined
            }
            onChange={field.onChange}
            selected={new Date(field.value)}
            dateFormat="MMMM d, yyyy h:mm aa"
          />
          {formState.errors.existingTask &&
            formState.errors.existingTask[0][fieldName] && (
              <FormErrorMessage>
                {formState.errors.existingTask[0][fieldName]!.message}
              </FormErrorMessage>
            )}
        </FormControl>
      )}
    />
  );
};

export default EditTaskDatepicker;
