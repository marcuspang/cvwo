import {
  Button,
  IconButton,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useEditableControls,
} from "@chakra-ui/react";
import { FaCheck, FaTrashAlt } from "react-icons/fa";
import {
  useArchiveListMutation,
  useDeleteListMutation,
} from "../../app/services/list";
import DeleteModal from "../Modal/DeleteModal";

interface ListIconProps {
  id: number;
}

const ListTitleButton = ({ id }: ListIconProps) => {
  const { isEditing } = useEditableControls();
  const [archiveList, { isLoading }] = useArchiveListMutation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onConfirm = async () => {
    // delete on database
    await archiveList({ id, archive: true });
    onClose();
  };

  return (
    <>
      <IconButton
        variant={"ghost"}
        aria-label={isEditing ? "Submit list changes" : "Delete list"}
        icon={<FaTrashAlt />}
        onClick={() => {
          if (!isEditing) {
            onOpen();
          }
        }}
        mb={1}
      />
      <DeleteModal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={onConfirm}
        isLoading={isLoading}
      />
    </>
  );
};

export default ListTitleButton;
