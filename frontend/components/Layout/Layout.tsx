import { Box, Container, useColorModeValue } from "@chakra-ui/react";
import Footer from "./Footer";
import Navbar from "./Navbar";

const Layout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <Container
        as="main"
        maxW={"full"}
        background={useColorModeValue("gray.50", "gray.800")}
      >
        {children}
      </Container>
      <Footer />
    </>
  );
};

export default Layout;
