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
import { useDeleteListMutation } from "../../app/services/list";
import DeleteModal from "../Modal/DeleteModal";

interface ListIconProps {
  id: number;
}

const ListIcon = ({ id }: ListIconProps) => {
  const { isEditing } = useEditableControls();
  const [deleteList, { isLoading }] = useDeleteListMutation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onConfirm = async () => {
    // delete on database
    await deleteList(id);
    onClose();
  };

  return (
    <>
      <IconButton
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

export default ListIcon;
