import React, {useContext, useEffect, useState} from 'react';
import {Box, Divider, ListItem, ListItemButton, Paper} from "@mui/material";
import {ChatContext} from "../../context/ChatProvider";
import {ChatRoom, ChatRoomDto} from "./ChatRoom";
import {useNavigate, useParams} from "react-router-dom";
import {useToast} from "@chakra-ui/react";
import {isMobileScreen} from "../../App";
import {getChatRooms} from "../../api/Data";
import {useTranslation} from "react-i18next";

export default function MobileChatRooms() {
    const {t} = useTranslation();
    const {chatId} = useParams();
    const {chatRooms, chatRoom, setChatRoom, setChatRooms, setChatMessages} = useContext(ChatContext);
    const [userId, setUserId] = useState<number | null>(null)
    const [isMobile, setIsMobile] = useState(false)
    const navigate = useNavigate();
    const toast = useToast()
    const [bgColor, setBgColor] = useState('background.paper')
    const [textColor, setTextColor] = useState('black')
    const defaultColor = 'background.paper'

    const toChat = (chatRoom: ChatRoomDto) => {
        setChatRoom(chatRoom)
        navigate(`/chats/${chatRoom.chatId}`)
    }

    const toLogin = () => {
        navigate(`/signin`)
    }

    useEffect(() => {
        if (chatRoom != null) {
            setBgColor(!isMobile ? '#2d9d92' : 'background.paper')
            setTextColor(!isMobile ? 'white' : 'black')
        }

        const room = chatRooms.find((room) => room.chatId === chatId)
        if (room !== undefined) {
            setChatRoom(room)
        }
    }, [chatRoom, isMobile]);

    useEffect(() => {
        const userIdString = localStorage.getItem('userId')
        const userId = parseInt(userIdString ? userIdString : "-1")

        if (userId !== -1) {
            setUserId(userId)
            getChatRooms(userId)
                .then(r => {
                    setChatRooms(r)
                }).catch(e => console.error(e));
        } else {
            toast({
                title: t('log_in'),
                status: 'error',
                duration: 500,
                isClosable: true,
                position: 'top'
            })
            toLogin()
        }

        const handleResize = () => {
            setIsMobile(isMobileScreen());
        };

        // Установить начальное значение isMobile
        handleResize();

        // Добавить обработчик события resize
        window.addEventListener('resize', handleResize);

        // Очистить обработчик при размонтировании компонента
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <Box
            width={isMobile ? "100%" : "70%"}
            height="100%"
            display="flex"
            flexDirection="column"
            alignItems="center"
        >
            <Paper
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'absolute',
                    height: '100%',
                    width: '100%',
                }}
                elevation={2}
            >
                <Box display="flex" flexDirection="row" height="100%">
                    <Box sx={{
                        flex: isMobile ? 1.0 : 0.3,
                        overflowY: 'scroll',
                        marginBottom: isMobile ? '56px' : '0px',
                        padding: "0",
                        position: 'relative'
                    }}>
                        {chatRooms.map((chat, index) => (
                            <div key={index}>
                                <ListItem component="div" disablePadding
                                          sx={{backgroundColor: chatRoom?.id === chat.id ? bgColor : defaultColor}}>
                                    <ListItemButton onClick={e => toChat(chat)}>
                                        <ChatRoom
                                            chatRoom={{
                                                id: chat.id,
                                                chatId: chat.chatId,
                                                sender: chat.sender,
                                                recipient: chat.recipient
                                            }}
                                            backgroundColor={chatRoom?.id === chat.id ? bgColor : defaultColor}
                                            textColor={chatRoom?.id === chat.id ? textColor : 'black'}
                                        />
                                    </ListItemButton>
                                </ListItem>
                                <Divider variant="inset"/>
                            </div>
                        ))}
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
}