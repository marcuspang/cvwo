import { Button, useColorModeValue, VisuallyHidden } from "@chakra-ui/react";

interface SocialButtonProps {
  children: React.ReactNode;
  label: string;
  href: string;
}

export const SocialButton = ({ children, label, href }: SocialButtonProps) => {
  return (
    <Button
      bg={useColorModeValue("gray.100", "gray.900")}
      rounded={"lg"}
      w={8}
      h={8}
      p={2}
      cursor={"pointer"}
      as={"a"}
      href={href}
      display={"inline-flex"}
      alignItems={"center"}
      justifyContent={"center"}
      transition={"background 0.3s ease"}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </Button>
  );
};
