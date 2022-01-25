import { Text } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useGetLabelsQuery } from "../app/services/label";
import LabelTable from "../components/Label/LabelTable";
import Layout from "../components/Layout/Layout";

const LabelsPage: NextPage = () => {
  const {} = useGetLabelsQuery({});
  return (
    <Layout>
      <Text as="h1" fontSize={"xl"} fontWeight={"bold"} ml={4} mt={4}>
        Label Overview
      </Text>
      <LabelTable />
    </Layout>
  );
};

export default LabelsPage;
