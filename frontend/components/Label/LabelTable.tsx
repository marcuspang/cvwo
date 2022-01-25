import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import {
  IconButton,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaTrash } from "react-icons/fa";
import { selectLabels, updateLabel } from "../../app/features/labelSlice";
import { useArchiveLabelMutation } from "../../app/services/label";
import { useAppDispatch, useAppSelector } from "../../app/store";

interface LabelTableProps {}

const LabelTable = ({}: LabelTableProps) => {
  const labels = useAppSelector(selectLabels);
  const [archiveLabel] = useArchiveLabelMutation();
  const dispatch = useAppDispatch();

  return (
    <Table variant="simple" mt={4}>
      <Thead bgColor={useColorModeValue("gray.200", "gray.700")}>
        <Tr>
          <Th>Id</Th>
          <Th>Name</Th>
          <Th>Archive</Th>
        </Tr>
      </Thead>
      <Tbody>
        {labels.map(
          (label) =>
            !label.archived && (
              <Tr key={label.id}>
                <Td>{label.id}</Td>
                <Td>{label.name}</Td>
                <Td>
                  <IconButton
                    variant={"ghost"}
                    onClick={async () => {
                      await archiveLabel({
                        labelId: label.id,
                        archive: true,
                      }).unwrap();
                      dispatch(updateLabel({ ...label, archived: true }));
                    }}
                    icon={<FaTrash />}
                    aria-label="delete label"
                  />
                </Td>
              </Tr>
            )
        )}
      </Tbody>
    </Table>
  );
};

export default LabelTable;
