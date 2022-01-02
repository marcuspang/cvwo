import useSWR from "swr";
import fetcher from "../util/fetcher";

const useUser = () => {
  const { data, error } = useSWR(`/user/`, fetcher);

  return {
    user: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useUser;
