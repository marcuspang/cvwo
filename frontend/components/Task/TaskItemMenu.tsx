import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { removeListTask } from "../../app/features/listSlice";
import {
  useArchiveTaskMutation,
  useDeleteTaskMutation,
} from "../../app/services/task";
import { useAppDispatch } from "../../app/store";
import DropdownIcon from "../Icon/DropdownIcon";
import DeleteModal from "../Modal/DeleteModal";
import EditTaskModal from "../Modal/EditTaskModal";

interface TaskMenuProps {
  taskId: number;
  listId: number;
  index: number;
  remove: () => void;
  triggerFormSubmit: (index?: number) => void;
}

const TaskItemMenu = ({
  listId,
  taskId,
  index,
  remove,
  triggerFormSubmit,
}: TaskMenuProps) => {
  const [archiveTask, { isLoading }] = useArchiveTaskMutation();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const {
    isOpen: editIsOpen,
    onClose: editOnClose,
    onOpen: editOnOpen,
  } = useDisclosure();
  const [deleting, setDeleting] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    let controller = new AbortController();
    if (deleting) {
      (async () => {
        // delete on database
        await archiveTask({ id: taskId, archive: true });
        // remove on redux
        dispatch(removeListTask({ listId, taskId }));
        onClose();
        remove(); // will remove this component + TaskItem
      })();
    }
    return () => controller.abort();
  }, [deleting]);

  return (
    <>
      <Menu isLazy placement="bottom-end">
        <MenuButton
          as={IconButton}
          aria-label="Options"
          variant={"ghost"}
          size={"sm"}
          icon={<DropdownIcon />}
        />
        <MenuList shadow={"md"} width={"30px"}>
          <MenuItem onClick={editOnOpen}>Edit</MenuItem>
          <MenuItem onClick={onOpen}>Delete</MenuItem>
        </MenuList>
      </Menu>
      <DeleteModal
        isOpen={isOpen}
        onClose={onClose}
        isLoading={isLoading}
        onConfirm={() => setDeleting(true)}
      />
      <EditTaskModal
        index={index}
        isOpen={editIsOpen}
        onClose={editOnClose}
        triggerFormSubmit={triggerFormSubmit}
      />
    </>
  );
};

export default TaskItemMenu;
