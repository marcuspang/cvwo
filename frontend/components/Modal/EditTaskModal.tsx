import { selectTaskById } from "../../app/features/taskSlice";
import { useAppSelector } from "../../app/store";

interface EditTaskModalProps {
  taskId: number;
}

const EditTaskModal = ({ taskId }: EditTaskModalProps) => {
  const task = useAppSelector(selectTaskById(1));
  return <></>;
};

export default EditTaskModal;
