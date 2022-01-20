import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
} from "@chakra-ui/react";
import { removeListTask } from "../../app/features/listSlice";
import { useDeleteTaskMutation } from "../../app/services/task";
import { useAppDispatch } from "../../app/store";
import DeleteModal from "../Modal/DeleteModal";
import DropdownIcon from "../Icon/DropdownIcon";
import EditTaskModal from "../Modal/EditTaskModal";
import type { FormInputInterface } from "../Lists/ListCard";
import { Control, useFieldArray, useFormContext } from "react-hook-form";

interface TaskMenuProps {
  taskId: number;
  listId: number;
}

const TaskItemMenu = ({ listId, taskId }: TaskMenuProps) => {
  const [deleteTask, { isLoading }] = useDeleteTaskMutation();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const dispatch = useAppDispatch();
  const { control } = useFormContext();

  // const { remove, fields } = useFieldArray({
  //   control,
  //   name: "existingTask",
  // });
  // console.log(fields);

  const onConfirm = async () => {
    // delete on database
    await deleteTask(taskId);
    // remove on redux (not necessary?)
    dispatch(removeListTask({ listId, taskId }));
    onClose();
  };

  return (
    <>
      <Menu isLazy placement="bottom-end" size={"sm"}>
        <MenuButton
          as={IconButton}
          aria-label="Options"
          size={"sm"}
          icon={<DropdownIcon />}
        />
        <MenuList shadow={"md"}>
          <MenuItem onClick={onOpen}>Delete</MenuItem>
          <MenuItem>Edit</MenuItem>
        </MenuList>
      </Menu>
      <DeleteModal
        isOpen={isOpen}
        onClose={onClose}
        isLoading={isLoading}
        onConfirm={onConfirm}
      />
      <EditTaskModal taskId={taskId} />
    </>
  );
};

export default TaskItemMenu;
