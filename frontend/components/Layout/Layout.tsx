import { Container, useColorModeValue } from "@chakra-ui/react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <Container
      as="main"
      maxW={"full"}
      h={"100vh"}
      px={0}
      background={useColorModeValue("gray.50", "gray.800")}
    >
      {children}
    </Container>
  );
};

export default Layout;
