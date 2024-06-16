import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Box, Button, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import { IoMdArrowRoundBack } from "react-icons/io";
import { getSender, getSenderDetails } from '../config/ChatNameFunction';
import ProfileModal from './miscellaneous/ProfileModal';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import { LuSendHorizonal } from "react-icons/lu";
import axios from 'axios';
import ScrollChat from './ScrollChat';

const SingleChat = ({ fetchAgain , setFetchAgain }) => {

  const [message , setMessage] = useState()
  const [NewMessage , setNewMessage] = useState([])
  const [loading , setLoading] = useState(false)
  
  const toast = useToast()
  const { user , selectedChat , setSelectedChat } = ChatState()

  const sendMessages = async () => {
    if(NewMessage){
     try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`
        },
      }
      
      setNewMessage("")
      const { data } = await axios.post("/api/message" , {
        content: NewMessage ,
        chatId: selectedChat._id
      } , config)

      setMessage([...message , data])      
     } catch (error) {
         toast({
           title: "Error Occured!",
           description: "Failed to send the Message",
           status: "error",
           duration: 5000,
           isClosable: true,
           position: "bottom",
         });
     }
    }
  }

  const fetchMessages = async () => {
    if(!selectedChat) return

    try {
      setLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        },
      }

      const { data } = await axios.get(`/api/message/${selectedChat._id}` , config)  

      setMessage(data)
      setLoading(false)
    } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to fetch the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
    }
  }

  useEffect(() => {
    fetchMessages()
  },[selectedChat])

  const typingHandler = (e) => {
     setNewMessage(e.target.value)
  }

  return (
    <>
     {selectedChat ? (
       <>
        <Text
          fontSize={{base: "28px", md: "30px"}}
          fontFamily="Work Sans"
          display="flex"
          justifyContent={{base: "space-between"}}
          alignItems="center"
          w="100%"
          pb="3"
          px="2"
        >
          <IconButton
            mx="2"
            display={{base: "flex", md: "none"}}
            icon={<IoMdArrowRoundBack />}
            onClick={() => setSelectedChat("")} 
          />
          {!selectedChat.isGroupChat ? (
            <>
             {getSender(user , selectedChat.users)}
             <ProfileModal user={getSenderDetails(user , selectedChat.users)} />
            </>
            ) : (
            <>
             {selectedChat.chatName}
             <UpdateGroupChatModal 
               fetchAgain={fetchAgain} 
               setFetchAgain={setFetchAgain}
               fetchMessages={fetchMessages} 
             />
            </>
          )}
        </Text>
        <Box 
          w="100%"
          h="100%"
          p="3"
          display="flex" 
          flexDir="column"
          justifyContent="flex-end"
          bg="#E8E8E8" 
          borderRadius="lg" 
          borderWidth="1px"
          overflowY="hidden"
        >

          {loading ? 
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100%"
              width="100%"
            >
              <Spinner
                size="xl"
                height="20"
                width="20"
              />
            </Box> : 
            (
              <div style={{
                  display: "flex",
                  flexDirection: "column",
                  overflowY: "scroll",
                  scrollbarWidth: "none",  
                  msOverflowStyle: "none"                  
                }}
              >
                <ScrollChat message={message} />
              </div>
            )
          }
          <FormControl display="flex" mt="3" alignItems="center">
            <Input 
              p="5"
              mx="2"
              w="100%"
              bg="white"
              variant="filled"
              value={NewMessage}
              placeholder="Enter your message here"
              onChange={typingHandler}
            />
            <Button 
              p="3"
              colorScheme="teal"
              onClick={sendMessages}
            >  
              <LuSendHorizonal style={{fontSize: "20px"}}/>
            </Button>
          </FormControl>
        </Box>
       </>
     ) : (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        h="100%"
      >
        <Text
          pb="3"
          fontFamily="Work Sans"
          fontSize="3xl"   
        >
         Click on a User to start chatting
        </Text>
      </Box>
     )}
      
    </>
  )
}

export default SingleChat
