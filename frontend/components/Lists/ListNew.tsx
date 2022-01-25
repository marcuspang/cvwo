import { PlusSquareIcon } from "@chakra-ui/icons";
import { Box, IconButton } from "@chakra-ui/react";

interface ListNewProps {
  onOpen: () => void;
}

const ListNew = ({ onOpen }: ListNewProps) => {
  return (
    <Box
      w={"sm"}
      ml={4}
      verticalAlign={"top"}
      display={"inline-flex"}
      shadow="md"
      rounded="md"
    >
      <IconButton
        aria-label="Add list"
        icon={<PlusSquareIcon />}
        onClick={onOpen}
        w={"full"}
      />
    </Box>
  );
};

export default ListNew;
