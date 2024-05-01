import React, {useContext, useEffect, useRef, useState} from 'react';
import {Avatar, Box, Divider, IconButton, ListItem, ListItemButton, Paper} from "@mui/material";
import {ChatContext, ChatMessageDto} from "../../context/ChatProvider";
import {ChatRoom, ChatRoomDto} from "./ChatRoom";
import {useNavigate, useParams} from "react-router-dom";
import {useToast} from "@chakra-ui/react";
import {isMobileScreen} from "../../App";
import {
    ChatNotificationDto,
    findChatMessage,
    findChatMessages,
    getChatRooms, getUser,
    userPhoto, wsUrl
} from "../../api/Data";
import {ArrowBackIcon} from "@chakra-ui/icons";
import profile from "../../assets/images/agents/profile.png";
import {MessageLeft, MessageRight} from "./Message";
import {TextInput} from "./TextInput";
import SockJs from "sockjs-client";
import Stomp, {Frame, Message} from "stompjs";
import {flushSync} from "react-dom";
import {ZonedDateTime} from "@js-joda/core";
import {sendNotify} from "../../service-worker";

export default function ChatRooms() {
    const {chatId} = useParams();
    const {chatRooms, chatRoom, setChatRoom, setChatRooms, chatMessages, setChatMessages} = useContext(ChatContext);
    const [userId, setUserId] = useState<number | null>(null)
    const [isMobile, setIsMobile] = useState(false)
    const navigate = useNavigate();
    const toast = useToast()
    const [bgColor, setBgColor] = useState('background.paper')
    const [textColor, setTextColor] = useState('black')
    const defaultColor = 'background.paper'
    const listRef = useRef<HTMLUListElement | null>(null);
    const [connected, setConnected] = useState<boolean>(false)

    const toChat = (chatRoom: ChatRoomDto) => {
        setChatRoom(chatRoom)
        navigate(`/chats/${chatRoom.chatId}`)
    }

    const toLogin = () => {
        navigate(`/signin`)
    }

    const backToChats = () => {
        setChatRoom(null)
        setChatMessages([])
        navigate(`/`)
    }

    const socket = new SockJs(wsUrl);
    const stompClient = Stomp.over(socket);
    stompClient.debug = () => {
    };

    const onConnected = () => {
        setConnected(true)
        stompClient.subscribe(
            "/user/" + chatRoom?.sender.id + "/queue/messages",
            onMessageReceived
        );
    };

    const onError = (err: string | Frame) => {
        console.log(err);
    };

    const onMessageReceived = (msg: Message) => {
        const notification = JSON.parse(msg.body) as ChatNotificationDto;

        try {
            sendNotify(notification.message)
        } catch (e) {
            console.log(e)
        }

        findChatMessage(notification.messageId).then((message) => {
            flushSync(() => addMessageToChat(message))

            listRef.current?.lastElementChild?.scrollIntoView();
        }).catch(e => console.log(e));
    };

    const sendMessage = (msg: string) => {
        if (msg.trim() !== "" && chatRoom) {
            const message: ChatMessageDto = {
                id: 0,
                chatId: chatRoom.chatId,
                sender: chatRoom.sender,
                recipient: chatRoom.recipient,
                content: msg,
                zonedDateTime: ZonedDateTime.now().withFixedOffsetZone()
            };

            stompClient.send("/app/chat", {}, JSON.stringify(message));

            /*flushSync(() => {
                addMessageToChat(message);
            })

            listRef.current?.lastElementChild?.scrollIntoView();*/
        }
    };

    const addMessageToChat = (newMessage: ChatMessageDto) => {
        setChatMessages(prevMessages => [...prevMessages, newMessage]);
    }

    const addMessagesToChat = (newMessages: ChatMessageDto[]) => {
        setChatMessages(prevMessages => [...prevMessages, ...newMessages]);
    }

    useEffect(() => {
        setBgColor(!isMobile ? '#2d9d92' : 'background.paper')
        setTextColor(!isMobile ? 'white' : 'black')

        /*const room = chatRooms.find((room) => room.chatId === chatRoom?.chatId)
        if (room !== undefined) {
            setChatRoom(room)
        }*/
    }, [chatRoom]);

    useEffect(() => {
        if (chatRoom !== null) {
            setChatMessages([])

            findChatMessages(chatRoom?.sender.id, chatRoom?.recipient.id)
                .then(r => addMessagesToChat(r))
                .catch(e => console.log(e));
        }

        if (chatRoom !== null && !connected) {
            try {
                stompClient.connect({}, onConnected, onError);
            } catch (e) {
                console.log(e)
            }
        }

        return () => {
            if (chatRoom !== null && !connected) {
                try {
                    stompClient.disconnect(() => {
                        console.log('disconnected')
                    })
                } catch (e) {
                    console.log(e)
                }
            }
        };
    }, [chatRoom]);

    useEffect(() => {
        if (chatRoom === null && chatId !== undefined) {
            const room = chatRooms.find((room) => room.chatId === chatId)
            if (room !== undefined) {
                setChatRoom(room)
            } else {
                try {
                    const senderId = parseInt(chatId.split("_")[0])
                    const recipientId = parseInt(chatId.split("_")[1])

                    if (userId) {
                        getUser(senderId)
                            .then(sender => {
                                getUser(recipientId)
                                    .then(recipient => {
                                        const tempChatRoom: ChatRoomDto = {
                                            chatId: chatId, id: 0, sender: sender, recipient: recipient
                                        }
                                        setChatRoom(tempChatRoom)
                                    })
                                    .catch(() => {
                                    })
                            })
                            .catch(() => {
                            })
                    }
                } catch (e) {
                    console.log(e)
                }
            }
        } else {
            setChatMessages([])
        }
    }, [chatRooms]);

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
                title: 'Авторизуйтесь!',
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
                        <Box
                            sx={{
                                bgcolor: 'background.paper',
                                display: 'flex',
                                alignItems: 'center',
                                height: '56px'
                            }}
                        >
                            <IconButton
                                aria-label="send"
                                size="large"
                                sx={{height: '56px', color: '#2d9d92'}}
                                onClick={backToChats}
                            >
                                <ArrowBackIcon/>
                            </IconButton>
                            
                            <Box fontWeight="fontWeightBold" fontSize="22px" sx={{marginLeft: '10px'}}>Чаты</Box>
                        </Box>

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

                    {!isMobile && chatRoom ?
                        <Box sx={{
                            flex: 0.7,
                            padding: "0",
                            position: 'relative'
                        }}>
                            <Box
                                width="100%"
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
                                        width: '100%'
                                    }}
                                    elevation={2}
                                >
                                    <Box sx={{
                                        position: 'absolute',
                                        flexDirection: 'row',
                                        left: 0,
                                        right: 0,
                                        top: 0,
                                        boxShadow: 1,
                                        borderRadius: 1,
                                        borderColor: '#2d9d92',
                                    }}>
                                        <Box
                                            sx={{
                                                bgcolor: 'background.paper',
                                                display: 'flex',
                                                alignItems: 'center',
                                                height: '56px'
                                            }}
                                        >
                                            {isMobile && <IconButton
                                                aria-label="send"
                                                size="large"
                                                sx={{height: '56px', color: '#2d9d92'}}
                                                onClick={backToChats}
                                            >
                                                <ArrowBackIcon/>
                                            </IconButton>}
                                            <Avatar
                                                alt={""}
                                                src={chatRoom?.recipient.id ? userPhoto(chatRoom.recipient.id) : profile}
                                                sx={{
                                                    color: 'text.primary',
                                                    width: '48px',
                                                    height: '48px',
                                                    marginLeft: isMobile ? '0px' : '10px'
                                                }}
                                            />
                                            <Box fontWeight="fontWeightBold" fontSize="22px"
                                                 sx={{marginLeft: '10px'}}>{chatRoom ? `${chatRoom.recipient.firstName} ${chatRoom.recipient.lastName}` : "..."}</Box>
                                        </Box>
                                    </Box>

                                    <Box sx={{
                                        flex: 1,
                                        overflowY: 'scroll',
                                        marginTop: '57px',
                                        marginBottom: isMobile ? '106px' : '56px',
                                        padding: "16px 16px 0px 16px",
                                        position: 'relative'
                                    }}
                                         ref={listRef}
                                    >
                                        {chatMessages.map((msg) => (
                                            msg.sender.id === userId ? (
                                                <MessageRight
                                                    key={msg.id}
                                                    id={msg.id}
                                                    chatId={msg.chatId}
                                                    sender={msg.sender}
                                                    recipient={msg.recipient}
                                                    content={msg.content}
                                                    zonedDateTime={msg.zonedDateTime}
                                                    status={msg.status}
                                                />
                                            ) : (
                                                <MessageLeft
                                                    key={msg.id}
                                                    id={msg.id}
                                                    chatId={msg.chatId}
                                                    sender={msg.sender}
                                                    recipient={msg.recipient}
                                                    content={msg.content}
                                                    zonedDateTime={msg.zonedDateTime}
                                                    status={msg.status}
                                                />
                                            )
                                        ))}
                                    </Box>
                                    <Box sx={{
                                        position: 'absolute',
                                        bottom: isMobile ? '50px' : '0px',
                                        left: 0,
                                        right: 0
                                    }}>
                                        <TextInput onClick={sendMessage}/>
                                    </Box>
                                </Paper>
                            </Box>
                        </Box> : <></>
                    }
                </Box>
            </Paper>
        </Box>
    );
}
