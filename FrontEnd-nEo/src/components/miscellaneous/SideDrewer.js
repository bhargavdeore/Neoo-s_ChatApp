import React, { useState } from 'react';
import { Box, Tooltip, Button, Text, Menu, MenuButton, MenuList, MenuItem, MenuDivider, Drawer, useDisclosure, DrawerBody, DrawerHeader, DrawerContent, DrawerOverlay, Input, useToast, Spinner } from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { ChatState } from '../../Context/ChatProvider';
import { Avatar } from '@chakra-ui/avatar'
import ProfileModeal from './ProfileModeal';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import ChatLoading from '../ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';
import { getSender } from '../../config/ChatLogics';
import { NotificationBadge } from 'react'
// import { } from 'react-notification-badge'

const SideDrewer = () => {

    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setloadingChat] = useState();

    const { user , setSelectedChat , chats, setChats, notification, setNotification} = ChatState();
    const history = useHistory();
    const { isOpen, onOpen, onClose } = useDisclosure()


    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        //  localStorage.clear("userInfo");
        history.push("/");
    };

    const toast = useToast();

    const handlerSearch = async () => {
        if (!search) {
            toast({
                title: 'Please Enter something in search',
                description: "",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "top-left",
            });
            return;
        }
        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get(`/api/user?search=${search}`, config);

            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toast({
                title: 'Error Occured!',
                description: "Failde to Load the Search Results",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }

    }

    const accessChat = async (userId) => {
        try {
            setloadingChat(true)

            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.post("/api/chat", { userId }, config);

            if (!chats.find((c) => c._id === data._id )) setChats([data, ...chats]);

                setSelectedChat(data);
                setloadingChat(false);
                onClose();
        } catch (error) {
            toast({
                title: 'Error fetching the chat',
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    };

    return (
        <>
            <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} bg={'white'} w={'100%'} p={'5px 10px 5px 10px'} borderWidth={'5px'}>
                <Tooltip label="search Users to chat" hashArrow placement='bottom-end'>
                    <Button variant='ghost' onClick={onOpen}>
                        <i class="fa-solid fa-magnifying-glass"></i>
                        <Text display={{ base: "none", md: "flex" }} px='4'>
                            Search User
                        </Text>
                    </Button>
                </Tooltip>

                <Text fontSize={'2xl'} fontFamily={'Work sans'}>
                    Neoo's ChatApp
                </Text>

                <div>
                    <Menu>
                        <MenuButton p={1}>
                            {/* <NotificationBadge
                                count={notification.length}
                                effect={Effect.SCALE}
                            /> */}
                            <BellIcon fontSize={'2xl'} m={1} />
                           <MenuList pl={2}>
                            {!notification.length && "No New Messages"}
                            {notification.map((notif) => (
                                <MenuItem key={notif._id}
                                          onClick={() => {
                                            setSelectedChat(notif.chat);
                                            setNotification(notification.filter((n) => n !== notif));
                                          }}
                                >
                                {notif.chat.isGroupChat
                                    ? `New Message in ${notif.chat.chatName}`
                                    :  `New Message from ${getSender(user, notif.chat.users)}`}
                                </MenuItem>
                            ))}
                           </MenuList>
                        </MenuButton>
                    </Menu>

                    <Menu>
                        <MenuButton as={Button}
                            rightIcon={<ChevronDownIcon />} >
                            <Avatar size='sm' cursor='pointer' name={user.name} src={user.pic} />
                        </MenuButton>
                        <MenuList>
                            <ProfileModeal user={user}>
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModeal>

                            <MenuDivider />
                            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                        </MenuList>

                    </Menu>


                </div>
            </Box>


            <Drawer placement='left' onClose={onClose} isOpen={isOpen}>

                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth="1px"> Search Users </DrawerHeader>

                    <DrawerBody>
                        <Box display={'flex'} pb={2}>
                            <Input placeholder='Search by name or email' mr={2}
                                value={search} onChange={(e) => setSearch(e.target.value)} />
                            <Button
                                onClick={handlerSearch}
                            >Go</Button>
                        </Box>
                        {loading ? <ChatLoading /> :
                            (
                                searchResult?.map((user) => (
                                    <UserListItem
                                        key={user._id}
                                        user={user}
                                        handleFunction={() => accessChat(user._id)}
                                    />
                                ))
                            )
                        }

                        {loadingChat && <Spinner ml={"auto"} display={"flex"}/>}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default SideDrewer