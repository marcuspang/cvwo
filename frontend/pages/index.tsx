import {
  Avatar,
  Button,
  Flex,
  Grid,
  GridItem,
  useColorModeValue,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import ColourModeButton from "../components/Layout/ColourModeButton";
import Layout from "../components/Layout/Layout";

const Home: NextPage = () => {
  return (
    <Layout>
      <Grid templateColumns={"repeat(6, 1fr)"} h={"full"}>
        <GridItem colSpan={1} bg={useColorModeValue("", "gray.700")}>
          <Flex p={3} w={"full"}>
            <Flex alignItems={"center"}>
              <Button mr={3} px={3} w={"full"}>
                <Avatar size={"xs"} mr={3} />
                Login here
              </Button>
              <ColourModeButton />
            </Flex>
          </Flex>
        </GridItem>
        <GridItem colSpan={5} bg={useColorModeValue("gray.300", "gray.800")}>
          right
        </GridItem>
      </Grid>
    </Layout>
  );
};

export default Home;
