import { PlusSquareIcon } from "@chakra-ui/icons";
import { Box, IconButton, Stack } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import Layout from "../components/Layout/Layout";
import ListCard from "../components/ListCard/ListCard";
import theme from "../theme/theme";
export interface TaskInterface {
  name: string;
  done: boolean;
  deleted: boolean;
  dueDate?: Date;
}

export interface ListInterface {
  title: string;
  tasks?: TaskInterface[];
  deleted: boolean;
}

const lists: ListInterface[] = [
  {
    title: "first list",
    tasks: [
      {
        name: "do laundry",
        done: false,
        deleted: false,
        dueDate: new Date(),
      },
      {
        name: "finish CVWO mockup",
        done: false,
        deleted: false,
      },
    ],
    deleted: false,
  },
  {
    title: "second",
    deleted: false,
  },
];

const Home: NextPage = () => {
  const router = useRouter();

  // Layout contains Sidebar
  // children passed in Layout refers to main content in pages
  return (
    <Layout>
      <Stack gap={0} direction={"row"} pt={5}>
        {lists.map((list, key) => {
          return <ListCard key={key} list={list} />;
        })}
        <Box w={"sm"} pl={4}>
          <IconButton
            aria-label="Add list"
            icon={<PlusSquareIcon />}
            w={"full"}
          />
        </Box>
      </Stack>
    </Layout>
  );
};

export default Home;
