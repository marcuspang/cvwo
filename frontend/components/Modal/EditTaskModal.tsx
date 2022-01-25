import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useRef } from "react";
import { useFormContext } from "react-hook-form";
import LabelAutocomplete from "../Label/LabelAutocomplete";
import type { FormInputInterface } from "../Lists/ListCard";
import EditTaskDatepicker from "../Task/EditTaskDatepicker";

interface EditTaskModalProps {
  index: number;
  isOpen: boolean;
  onClose: () => void;
  triggerFormSubmit: (index?: number) => void;
}

const EditTaskModal = ({
  index,
  isOpen,
  onClose,
  triggerFormSubmit,
}: EditTaskModalProps) => {
  const { getValues, control, formState } =
    useFormContext<FormInputInterface>();
  const task = getValues(`existingTask.${index}`);
  const initialRef = useRef<HTMLButtonElement>(null);

  return (
    <Modal isOpen={isOpen} onClose={onClose} initialFocusRef={initialRef}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{task.name}</ModalHeader>
        <ModalBody>
          <EditTaskDatepicker
            control={control}
            index={index}
            title="Start Date"
            fieldName="startDate"
          />
          <EditTaskDatepicker
            control={control}
            index={index}
            title="Due Date"
            fieldName="dueDate"
          />
          <LabelAutocomplete task={task} />
        </ModalBody>
        <ModalCloseButton />
        <ModalFooter>
          <Button
            isLoading={formState.isSubmitting}
            onClick={() => triggerFormSubmit(index)}
            ref={initialRef}
            colorScheme={"messenger"}
            mr={2}
          >
            Confirm
          </Button>
          <Button onClick={onClose} variant={"ghost"}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditTaskModal;
