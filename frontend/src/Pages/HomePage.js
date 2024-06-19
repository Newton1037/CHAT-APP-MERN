import React from 'react'
import {Container , Box , Text , Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import Login from '../components/authentication/Login'
import Signup from '../components/authentication/Signup'

const HomePage = () => {

  return (
    <Container maxW="xl" centerContent>
      <Box 
        d="flex"
        justifyContent="center"
        p={3}
        bg={"white"}
        w="100%"
        m="40px 0 15px 0"
        borderWidth="1px"
        borderRadius="lg"
      >
        <Text fontSize="4xl" fontFamily="Work sans" color="black" align="center">
          Chit-Chat
        </Text>

      </Box>
      <Box  
        bg="white" 
        w="100%" 
        p={4} 
        color="black"
        borderRadius="lg" 
        borderWidth="1px"
      >
        <Tabs variant='soft-rounded' colorScheme='blue'>
           <TabList mb="1em">
              <Tab width="50%">Login</Tab>
              <Tab width="50%">Sign Up</Tab>
           </TabList>
           <TabPanels>
              <TabPanel>
                <Login />
              </TabPanel>
              <TabPanel>
                <Signup />
              </TabPanel>
           </TabPanels>
        </Tabs>
      </Box>

    </Container>
  )
}

export default HomePage
