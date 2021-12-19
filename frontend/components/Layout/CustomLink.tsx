import { ReactNode } from "react";
import NextLink from "next/link";
import {
  Link as ChakraLink,
  LinkProps as ChakraLinkProps,
  useColorModeValue,
} from "@chakra-ui/react";
import { LinkProps as NextLinkProps } from "next/dist/client/link";

interface CustomLinkProps {
  children?: ReactNode;
  href: string;
  nextLinkProps?: Omit<NextLinkProps, "href">;
  chakraLinkProps?: ChakraLinkProps;
}

export const CustomLink = ({
  children,
  href,
  nextLinkProps,
  chakraLinkProps,
}: CustomLinkProps) => (
  <NextLink passHref={true} href={href} {...nextLinkProps}>
    <ChakraLink
      px={2}
      py={1}
      rounded={"md"}
      _hover={{
        textDecoration: "none",
        bg: useColorModeValue("gray.200", "gray.700"),
      }}
      {...chakraLinkProps}
    >
      {children}
    </ChakraLink>
  </NextLink>
);
