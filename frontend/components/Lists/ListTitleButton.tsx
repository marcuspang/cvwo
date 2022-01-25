import {
  IconButton,
  useDisclosure,
  useEditableControls,
} from "@chakra-ui/react";
import { FaTrashAlt } from "react-icons/fa";
import { removeListById } from "../../app/features/listSlice";
import { useArchiveListMutation } from "../../app/services/list";
import { useAppDispatch } from "../../app/store";
import DeleteModal from "../Modal/DeleteModal";

interface ListIconProps {
  id: number;
}

const ListTitleButton = ({ id }: ListIconProps) => {
  const { isEditing } = useEditableControls();
  const [archiveList, { isLoading }] = useArchiveListMutation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useAppDispatch();

  const onConfirm = async () => {
    // delete on database
    await archiveList({ id, archive: true });
    dispatch(removeListById(id));
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
