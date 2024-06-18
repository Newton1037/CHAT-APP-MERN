import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider';
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import { FaPlus } from "react-icons/fa6";
import ChatLoading from './ChatLoading';
import axios from 'axios'
import { getSender } from '../config/ChatNameFunction';
import GroupChatModal from './miscellaneous/GroupChatModal';

const ChatLog = ({ fetchAgain }) => {
  const [loggedInUser, setLoggedInUser] = useState()
  const {user , selectedChat , setSelectedChat , chats , setChats} = ChatState()
  const toast = useToast()

  const fetchChats = async () => {  
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        },
      }
      
      const { data } = await axios.get("/api/chat" , config)
      setChats(data)
    } catch (error) {
      toast({
        title: "Error loading the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
        colorScheme: "red"
      })
    }
  }

  useEffect(() => {
    setLoggedInUser(JSON.parse(localStorage.getItem("userInfo")))
    fetchChats()
  }, [fetchAgain])
  
  return (
    <Box
      display={{base: selectedChat ? "none" : "flex" , md: "flex"}}
      flexDir="column"
      bg="white"
      alignItems="center"
      p="3"
      w={{base: "100%", md: "30%"}}
      borderRadius="lg"
      borderWidth="1px"
    >

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        px="3"
        pb="3"
        w="100%"
        fontSize={{base: "25px", md: "30px"}}
        fontWeight="bold"
        fontFamily="Work Sans"
      >
         My Chats
         <GroupChatModal>
           <Button 
             display="flex"
             fontSize={{base: "17px", md: "10px", lg: "18px"}}
             rightIcon={<FaPlus />}
           >
             New Group Chat
           </Button>
         </GroupChatModal>
      </Box>

      <Box
        display="flex"
        flexDir="column"
        w="100%"
        h="100%"
        p="3"
        bg="#F8F8F8"
        borderRadius="lg"
        borderWidth="1px"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
               <Box 
                 onClick={() => setSelectedChat(chat)}
                 bg={selectedChat === chat ? "teal" : "#E8E8E8"}
                 color={selectedChat === chat ? "white" : "black"}
                 px="3"
                 py="2"
                 cursor="pointer"
                 borderRadius="lg"
                 key={chat._id}          
               >
                <Text>
                  {!chat.isGroupChat ? getSender(loggedInUser, chat.users) : chat.chatName}
                  {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                  )}
                </Text>
               </Box>
            ))}   
          </Stack>
        ) : <ChatLoading />}

      </Box>

    </Box>
  )
}

export default ChatLog
