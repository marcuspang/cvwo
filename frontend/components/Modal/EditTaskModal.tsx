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
import { CUIAutoComplete } from "chakra-ui-autocomplete";
import { useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useAddLabelMutation } from "../../app/services/label";
import type { FormInputInterface } from "../Lists/ListCard";
import EditTaskDatepicker from "../Task/EditTaskDatepicker";

interface EditTaskModalProps {
  index: number;
  isOpen: boolean;
  onClose: () => void;
  triggerFormSubmit: (index?: number) => void;
}

export interface Item {
  label: string;
  value: string;
}
const countries = [
  { value: "ghana", label: "Ghana" },
  { value: "nigeria", label: "Nigeria" },
  { value: "kenya", label: "Kenya" },
  { value: "southAfrica", label: "South Africa" },
  { value: "unitedStates", label: "United States" },
  { value: "canada", label: "Canada" },
  { value: "germany", label: "Germany" },
];

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
  const [addLabel, { isLoading }] = useAddLabelMutation();

  // ----
  const [pickerItems, setPickerItems] = useState(countries);
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);

  const handleCreateItem = async (item: Item) => {
    await addLabel({ name: item.value, tasks: [task.id] });
    setPickerItems((curr) => [...curr, item]);
    setSelectedItems((curr) => [...curr, item]);
  };

  const handleSelectedItemsChange = (selectedItems?: Item[]) => {
    if (selectedItems) {
      setSelectedItems(selectedItems);
    }
  };
  // ---

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
          <CUIAutoComplete
            label="Labels"
            placeholder="Choose labels"
            onCreateItem={handleCreateItem}
            items={task.labels.map((label) => ({
              label: label.name,
              value: label.name,
            }))}
            selectedItems={selectedItems}
            labelStyleProps={{ marginBottom: -1 }}
            inputStyleProps={{
              borderRightRadius: 0,
            }}
            toggleButtonStyleProps={{
              marginLeft: "0 !important",
              borderLeftRadius: 0,
            }}
            listItemStyleProps={{
              transition: "0.2s all ease",
            }}
            onSelectedItemsChange={(changes) =>
              handleSelectedItemsChange(changes.selectedItems)
            }
          />
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
