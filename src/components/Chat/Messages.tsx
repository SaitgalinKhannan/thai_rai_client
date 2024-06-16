import React, {useContext, useEffect, useRef, useState} from 'react';
import {TextInput} from './TextInput';
import {Avatar, Box, IconButton, Paper} from "@mui/material";
import {ChatContext, ChatMessageDto} from "../../context/ChatProvider";
import {
    ContextMenu,
    MessageLeft,
    MessageRight,
    MobileContextMenu,
    MobileMessageLeft,
    MobileMessageRight
} from "./Message";
import {isMobileScreen} from "../../App";
import {ArrowBackIcon} from "@chakra-ui/icons";
import {useNavigate, useParams} from "react-router-dom";
import Stomp, {Frame, Message} from 'stompjs';
import SockJs from 'sockjs-client';
import {
    ChatNotificationDto,
    findChatMessage,
    findChatMessages, getUser,
    userPhoto, wsUrl
} from "../../api/Data";
import profile from "../../assets/images/agents/profile.png";
import {ZonedDateTime} from "@js-joda/core";
import {flushSync} from "react-dom";
import {ChatRoomDto} from "./ChatRoom";
import useContextMenu from "../../context/useContextMenu";
import {useToast} from "@chakra-ui/react";

export default function Messages() {
    const {chatId} = useParams();
    const navigate = useNavigate();
    const listRef = useRef<HTMLUListElement | null>(null);
    const {chatRoom, chatRooms, setChatRoom, chatMessages, setChatMessages} = useContext(ChatContext);
    const [isMobile, setIsMobile] = useState(false);
    const [userId, setUserId] = useState<number | null>(null);
    const [connected, setConnected] = useState<boolean>(false);
    const toast = useToast();

    const {
        clicked,
        setClicked,
        points,
        setPoints,
        message,
        setMessage,
        isMessageLeft,
        setIsMessageLeft
    } = useContextMenu();

    const backToChats = () => {
        setChatRoom(null)
        setChatMessages([])
        navigate("/chats")
    }

    const socket = new SockJs(wsUrl);
    const stompClient = Stomp.over(socket);
    stompClient.debug = () => {
    };

    const onConnected = () => {
        try {
            stompClient.subscribe(
                "/user/" + chatRoom?.sender.id + "/queue/messages",
                onMessageReceived
            )
            setConnected(true)
        } catch (e) {
            console.error(e)
        }
    };

    const onError = (err: string | Frame) => {
        console.log(err);
    };

    const onMessageReceived = (msg: Message) => {
        const notification = JSON.parse(msg.body) as ChatNotificationDto;

        findChatMessage(notification.messageId).then((message) => {
            flushSync(() => addMessageToChat(message))
        }).catch(e => console.log(e));
    };

    useEffect(() => {
        listRef.current?.lastElementChild?.scrollIntoView();
    }, [chatMessages]);

    const sendMessage = (msg: string) => {
        if (msg.trim() !== "" && chatId && chatRoom) {
            const message: ChatMessageDto = {
                id: "",
                relatedMessageId: "",
                chatId: chatId,
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

    async function copyTextToClipboard(text: string) {
        await navigator.clipboard.writeText(text)
    }

    useEffect(() => {
        let userIdString = localStorage.getItem("userId");
        let userId = parseInt(userIdString ? userIdString : "-1");

        if (userId !== -1) {
            setUserId(userId);
        }

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

    useEffect(() => {
        if (chatRoom !== null) {
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
            if (chatRoom !== null) {
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
        if (clicked && message !== null) {
            console.log(`${clicked} ${message.id} ${message.relatedMessageId}`)
        }
    }, [clicked, message]);

    return (
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
                            <MobileMessageRight
                                key={msg.id}
                                chatMessage={{
                                    id: msg.id,
                                    relatedMessageId: msg.relatedMessageId,
                                    chatId: msg.chatId,
                                    sender: msg.sender,
                                    recipient: msg.recipient,
                                    content: msg.content,
                                    zonedDateTime: msg.zonedDateTime,
                                    status: msg.status
                                }}
                                onClick={(e) => {
                                    console.log(`x: ${e.pageX} y: ${e.pageY}`)
                                    e.preventDefault();
                                    setClicked(true);
                                    setPoints({
                                        x: e.pageX,
                                        y: e.pageY,
                                    });
                                    setIsMessageLeft(false);
                                    setMessage(msg);
                                }}
                            />
                        ) : (
                            <MobileMessageLeft
                                key={msg.id}
                                chatMessage={{
                                    id: msg.id,
                                    relatedMessageId: msg.relatedMessageId,
                                    chatId: msg.chatId,
                                    sender: msg.sender,
                                    recipient: msg.recipient,
                                    content: msg.content,
                                    zonedDateTime: msg.zonedDateTime,
                                    status: msg.status
                                }}
                                onClick={(e) => {
                                    console.log(`x: ${e.pageX} y: ${e.pageY}`)
                                    e.preventDefault();
                                    setClicked(true);
                                    setPoints({
                                        x: e.pageX,
                                        y: e.pageY,
                                    });
                                    setIsMessageLeft(true);
                                    setMessage(msg);
                                }}
                            />
                        )
                    ))}
                </Box>
                <Box sx={{position: 'absolute', bottom: isMobile ? '50px' : '0px', left: 0, right: 0}}>
                    <TextInput onClick={sendMessage}/>
                </Box>
            </Paper>
            {clicked && message !== null && (
                <MobileContextMenu
                    message={message}
                    isMessageLeft={isMessageLeft}
                    top={points.y}
                    left={points.x}
                    copyTextToClipboard={copyTextToClipboard}
                    updateMessage={() => {}}
                    deleteMessage={() => {}}
                />
            )}
        </Box>
    );
}