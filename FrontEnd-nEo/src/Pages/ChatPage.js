// import React, { useEffect, useState } from 'react'
// import axios from "axios"
import { ChatState } from '../Context/ChatProvider';
import SideDrewer from '../components/miscellaneous/SideDrewer';
import { Box } from "@chakra-ui/react"
import Mychats from "../components/Mychats";
import ChatBox from "../components/ChatBox";
import { useState } from 'react';

const ChatPage = () => {
  const { user } = ChatState();
  const { fetchAgain , setFetchAgain} = useState(false)

  return (
    <div style={{ width: "100%" }}>
    {user && <SideDrewer/>}
     <Box display={'flex'} justifyContent={'space-between'} w={'100%'} h={'91.5vh'} p={'10px'}>
      {user && <Mychats
        fetchAgain={fetchAgain} 
      />}
      {user && <ChatBox
        fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}
      />}
     </Box> 
    </div>
  );
};

export default ChatPage