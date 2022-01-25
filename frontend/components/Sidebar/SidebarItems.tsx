import { Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FaAddressBook, FaBook, FaCalendar, FaList, FaTasks } from "react-icons/fa";
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
      <SidebarItem icon={FaList} onClick={() => router.push("/")}>
        Lists
      </SidebarItem>
      <SidebarItem icon={FaTasks} onClick={() => router.push("/tasks")}>
        Tasks
      </SidebarItem>
      <SidebarItem icon={FaAddressBook} onClick={() => router.push("/labels")}>
        Labels
      </SidebarItem>
      <SidebarItem icon={FaCalendar} onClick={() => router.push("/calendar")}>
        Calendar
      </SidebarItem>
      <SidebarItem icon={FaBook} onClick={() => router.push("/archive")}>
        Archive
      </SidebarItem>
    </Flex>
  );
};

export default SidebarItems;
