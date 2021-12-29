import {
  Box,
  Checkbox,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  List,
  ListIcon,
  ListItem,
  useColorModeValue,
} from "@chakra-ui/react";
import { ListInterface } from "../../pages";
import ListTasks from "./ListTasks";

interface ListProps {
  list: ListInterface;
}

const ListCard = ({ list }: ListProps) => {
  return (
    <Flex
      w={"sm"}
      pl={4}
    >
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
          defaultValue={list.title}
        >
          <EditablePreview />
          <EditableInput rounded={"sm"} />
        </Editable>

        <List mt={2}>
          {list.tasks?.map((task, key) => (
            <ListTasks task={task} key={key} />
          ))}
          <ListTasks />
        </List>
      </Box>
    </Flex>
  );
};

export default ListCard;
