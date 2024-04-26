import { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
// import { withRouter } from 'react-router-dom/cjs/react-router-dom';

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const [user, setUser] = useState();
    const [selectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState([]);
    const [notification, setNotification] = useState([])

    const history = useHistory();

    useEffect(() => {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
       //const userInfo = JSON.parse(localStorage.getItem("userInfo")) ?? {};
      setUser(userInfo);

      if (!userInfo) {
        history.push("/");
      }
    
    }, [history]);
 
    
    return (
        
    <ChatContext.Provider 
    value={{ user , setUser , selectedChat, setSelectedChat , chats, 
             setChats , notification, setNotification}}>
    { children }
    </ChatContext.Provider>
    );
};

export const ChatState = () => {
    return useContext(ChatContext);
};

// export default withRouter(ChatProvider);
export default ChatProvider;



// import { createContext, useContext, useEffect, useState } from "react";
// import { useHistory } from "react-router-dom";

// const ChatContext = createContext();

// const ChatProvider = ({ children }) => {
//     const [user, setUser] = useState();

//     const history = useHistory();

//     useEffect(() => {
//       const userInfo = JSON.parse(localStorage.getItem("userInfo"));
//       console.log("userInfo from localStorage:", userInfo);
//       setUser(userInfo);

//       if (!userInfo) {
//         console.log("Redirecting to '/' because userInfo is missing.");
//         history.push("/");
//       }
//     }, [history]);
 
    
//     return (
//         <ChatContext.Provider value={{ user , setUser }}>
//             { children }
//         </ChatContext.Provider>
//     );
// };

// export const ChatState = () => {
//     return useContext(ChatContext);
// };

// export default ChatProvider;
