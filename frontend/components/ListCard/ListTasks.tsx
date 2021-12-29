import {
  Checkbox,
  CloseButton,
  Editable,
  EditableInput,
  EditablePreview,
  ListIcon,
  ListItem,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import { TaskInterface } from "../../pages";

interface ListTasksProps {
  task?: TaskInterface;
}

const ListTasks = ({ task }: ListTasksProps) => {
  const placeholderEditableColour = useColorModeValue("gray.400", "gray.500");
  const defaultEditableColour = useColorModeValue("gray.600", "gray.300");
  const [taskName, setTaskName] = useState(task?.name);

  // if there's no task name originally and no task has been inputted,
  // the colour should be placeholderEditableColour
  const editableColour = taskName
    ? defaultEditableColour
    : placeholderEditableColour;

  const temp = () => {
    console.log("pressed");
  };

  return (
    <ListItem
      display={"flex"}
      alignItems={"center"}
      onKeyPress={(e) => e.key === "Enter" && temp()}
    >
      <ListIcon
        as={Checkbox}
        lineHeight={"normal"}
        transition={"0.1s ease"}
        _hover={{
          bg: useColorModeValue("gray.100", "gray.900"),
        }}
      />
      <Editable
        color={editableColour} // _placeholder props don't work
        defaultValue={taskName}
        display={"inline-block"}
        placeholder={"enter your task"}
        w={"full"}
      >
        <EditablePreview />
        <EditableInput
          rounded={"sm"}
          onChange={(e) => setTaskName(e.target.value)}
        />
      </Editable>
      {taskName && <CloseButton />}
    </ListItem>
  );
};

export default ListTasks;
