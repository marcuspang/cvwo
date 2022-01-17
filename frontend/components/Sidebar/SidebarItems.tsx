import { Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FaCalendar, FaList, FaTasks } from "react-icons/fa";
import SidebarItem from "./SidebarItem";

const SidebarItems = () => {
  const router = useRouter();
  return (
    <Flex
      direction="column"
      as="nav"
      fontSize="sm"
      color="gray.600"
      aria-label="Main Navigation"
    >
      <SidebarItem icon={FaTasks} onClick={() => router.push("/")}>
        Tasks
      </SidebarItem>
      <SidebarItem icon={FaList} onClick={() => router.push("/lists")}>
        Lists
      </SidebarItem>
      <SidebarItem icon={FaCalendar} onClick={() => router.push("/calendar")}>
        Calendar
      </SidebarItem>
    </Flex>
  );
};

export default SidebarItems;
