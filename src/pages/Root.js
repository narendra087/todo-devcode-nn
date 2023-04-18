import { Box, Text } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

function Root() {
  return (
    <div className="app">
      <header>
        <Box height='105px' maxW='1040px' margin='0 auto' padding='0 20px' display='flex' alignItems='center'>
          <Text
            color='white'
            fontSize='24px'
            fontWeight={700}
          >
            TO DO LIST APP
          </Text>
        </Box>
      </header>
      <Box className='container' minH='calc(100vh - 105px)' maxW='1040px' margin='0 auto' padding='0 20px'>
        <Outlet />
      </Box>
    </div>
  );
}

export default Root;
