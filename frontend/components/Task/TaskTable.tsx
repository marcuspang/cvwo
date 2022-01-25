import {
  Table,
  TableCaption,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import { selectAllTasks } from "../../app/features/listSlice";
import { useAppSelector } from "../../app/store";

interface TaskTableProps {}

const formatDate = (input: string) => {
  const date = new Date(input);
  return date.toDateString() + " " + date.toLocaleTimeString();
};

const TaskTable = ({}: TaskTableProps) => {
  const tasks = useAppSelector(selectAllTasks);

  return (
    <Table variant="simple" mt={4}>
      <Thead bgColor={useColorModeValue("gray.200", "gray.700")}>
        <Tr>
          <Th>Id</Th>
          <Th>Name</Th>
          <Th>Start Date</Th>
          <Th>Due Date</Th>
          <Th>Done</Th>
          <Th>ListId</Th>
        </Tr>
      </Thead>
      <Tbody>
        {tasks.map((task) => (
          <Tr key={task.id}>
            <Td>{task.id}</Td>
            <Td>{task.name}</Td>
            <Td>{formatDate(task.startDate)}</Td>
            <Td>{formatDate(task.dueDate)}</Td>
            <Td>{task.done}</Td>
            <Td>{task.listId}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default TaskTable;
