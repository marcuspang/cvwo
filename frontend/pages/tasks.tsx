import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { selectLists } from "../app/features/listSlice";
import { selectUser } from "../app/features/userSlice";
import { useGetListsQuery } from "../app/services/list";
import { useGetTasksByListIdQuery } from "../app/services/task";
import { useAppSelector } from "../app/store";
import Layout from "../components/Layout/Layout";

const TasksPage: NextPage = () => {
  const { data: lists } = useGetListsQuery({});
  const [userId, setUserId] = useState(0);
  useEffect(() => {
    if (lists && lists.id) {
      setUserId(lists.id);
    }
  }, []);
  console.log(lists);

  const { data } = useGetTasksByListIdQuery(userId, {
    skip: !!userId,
  });
  console.log(data);
  return <Layout>hello</Layout>;
};

export default TasksPage;
