import { Box, Spinner } from "@chakra-ui/react";

const CustomSpinner = () => {
  return (
    <Box display="flex" justifyContent={"center"} width={"full"}>
      <Spinner />
    </Box>
  );
};

export default CustomSpinner;
