import {
  Box,
  Editable,
  EditableInput,
  EditablePreview,
  IconButton,
  List,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaTrash, FaTrashAlt } from "react-icons/fa";
import type { ListInterface } from "../../app/features/listSlice";
import ListTasks from "./ListTasks";

interface ListProps {
  listData: ListInterface;
}

const ListCard = ({ listData }: ListProps) => {
  return (
    <Box w={"sm"} pl={4} display={"inline-flex"}>
      <Box
        w="full"
        mx="auto"
        px={4}
        py={3}
        bg={useColorModeValue("white", "gray.700")}
        shadow="md"
        rounded="md"
      >
        <Editable
          fontSize="lg"
          fontWeight="bold"
          color={useColorModeValue("gray.800", "white")}
          defaultValue={listData.title}
        >
          <EditablePreview width={"calc(100% - 40px)"} mr={1} />
          <EditableInput rounded={"sm"} width={"calc(100% - 40px)"} mr={1} />
          <IconButton aria-label="Delete list" icon={<FaTrashAlt />} mb={1} />
        </Editable>

        <List mt={2}>
          {/* TODO add type for task */}
          {listData.tasks?.map((task: any, key: number) => (
            <ListTasks task={task} key={key} />
          ))}
          <ListTasks />
        </List>
      </Box>
    </Box>
  );
};

export default ListCard;
