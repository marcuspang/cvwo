import { Box, Grid, useColorModeValue } from "@chakra-ui/react";
import type { NextPage } from "next";
import Layout from "../components/Layout/Layout";

const Home: NextPage = () => {
  return (
    <Layout>
      <Grid
        templateColumns={"repeat(5, 1fr)"}
      >
        <Box colSpan={1}>left</Box>
        <Box colSpan={4}>right</Box>
      </Grid>
    </Layout>
  );
};

export default Home;
