import { Text } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useGetListsQuery } from "../app/services/list";
import Layout from "../components/Layout/Layout";
import TaskTable from "../components/TaskTable/TaskTable";

const TasksPage: NextPage = () => {
  const { isLoading } = useGetListsQuery({});

  return (
    <Layout>
      <Text as="h1" fontSize={"xl"} fontWeight={"bold"} ml={4} mt={4}>
        Task Overview
      </Text>
      <TaskTable />
    </Layout>
  );
};

export default TasksPage;
