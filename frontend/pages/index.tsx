import { PlusSquareIcon } from "@chakra-ui/icons";
import {
  Box,
  IconButton,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import Layout from "../components/Layout/Layout";
import ListModal from "../components/Lists/ListModal";
import ListNew from "../components/Lists/ListNew";
import Lists from "../components/Lists/Lists";
import { useHorizontalScroll } from "../hooks/useHorizontalScroll";

const Home: NextPage = () => {
  const ref = useHorizontalScroll();
  const { isOpen, onClose, onOpen } = useDisclosure();

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
            background: useColorModeValue(
              "var(--chakra-colors-gray-400)",
              "var(--chakra-colors-gray-600)"
            ),
            borderRadius: "5px",
          },
        }}
      >
        <Lists />
        <ListNew onOpen={onOpen} />
      </Box>
    </Layout>
  );
};

export default Home;
