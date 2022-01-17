import { PlusSquareIcon } from "@chakra-ui/icons";
import {
  Box,
  IconButton,
  Stack,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import type { ListInterface } from "../app/features/listSlice";
import { useAddListMutation, useGetListsQuery } from "../app/services/list";
import Layout from "../components/Layout/Layout";
import ListCard from "../components/ListCard/ListCard";
import ListModal from "../components/ListCard/ListModal";
import { useHorizontalScroll } from "../hooks/useHorizontalScroll";
export interface TaskInterface {
  name: string;
  done: boolean;
  deleted: boolean;
  dueDate?: Date;
}

// const lists: ListInterface[] = [
//   {
//     title: "first list",
//     tasks: [
//       {
//         name: "do laundry",
//         done: false,
//         deleted: false,
//         dueDate: new Date(),
//       },
//       {
//         name: "finish CVWO mockup",
//         done: false,
//         deleted: false,
//       },
//     ],
//     deleted: false,
//   },
// ];

const Home: NextPage = () => {
  const { data, isLoading } = useGetListsQuery({});
  const ref = useHorizontalScroll();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const scrollbarColour = useColorModeValue(
    "var(--chakra-colors-gray-400)",
    "var(--chakra-colors-gray-600)"
  );

  // Layout contains Sidebar
  // children passed in Layout refers to main content in pages
  return (
    <Layout>
      <ListModal isOpen={isOpen} onClose={onClose} />
      <Box
        gap={0}
        pt={5}
        whiteSpace="nowrap"
        position="relative"
        overflow={"auto"}
        height="full"
        ref={ref}
        css={{
          "&::-webkit-scrollbar": {
            width: "4px",
          },
          "&::-webkit-scrollbar-track": {
            width: "6px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: scrollbarColour,
            borderRadius: "5px",
          },
        }}
      >
        {!isLoading &&
          data &&
          data.map((list: ListInterface, key: number) => {
            return <ListCard key={key} listData={list} />;
          })}
        <Box
          w={"sm"}
          ml={4}
          mt={-1}
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
      </Box>
    </Layout>
  );
};

export default Home;
