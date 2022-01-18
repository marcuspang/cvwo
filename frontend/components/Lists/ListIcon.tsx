import { IconButton, useEditableControls } from "@chakra-ui/react";
import { FaTrashAlt } from "react-icons/fa";
import { useDeleteListMutation } from "../../app/services/list";

interface ListIconProps {
  id: number;
}

const ListIcon = ({ id }: ListIconProps) => {
  const { isEditing } = useEditableControls();
  const [deleteList] = useDeleteListMutation();

  return (
    <IconButton
      aria-label={isEditing ? "Submit list changes" : "Delete list"}
      icon={<FaTrashAlt />}
      onClick={() => {
        if (!isEditing) {
          deleteList(id);
        }
      }}
      mb={1}
    />
  );
};

export default ListIcon;
