import { Icon, IconProps } from "@chakra-ui/react";

const DropdownIcon = (props: IconProps) => {
  return (
    <Icon {...props} viewBox="0 0 16 16" height="1em" width="1em">
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"></path>
      </svg>
    </Icon>
  );
};

export default DropdownIcon;
