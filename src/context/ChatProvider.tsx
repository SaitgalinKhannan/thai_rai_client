import React, {createContext, useEffect, useMemo, useState} from "react";
import {ChatRoomDto} from "../components/Chat/ChatRoom";
import {getChatRooms} from "../api/Data";
import {UserDto, UserWithoutPassword} from "../api/model";
import {ZonedDateTime} from "@js-joda/core";

export interface TempMessage {
    chatId: string,
    message: string,
}

export enum MessageStatus {
    RECEIVED,
    DELIVERED
}

export interface ChatMessageDto {
    id: number;
    chatId: string;
    sender: UserWithoutPassword;
    recipient: UserWithoutPassword;
    content: string;
    zonedDateTime: ZonedDateTime;
    status?: MessageStatus;
}

export interface ChatContextI {
    chatId: string | null,
    setChatId: React.Dispatch<React.SetStateAction<string | null>>;
    chatRooms: ChatRoomDto[],
    setChatRooms: React.Dispatch<React.SetStateAction<ChatRoomDto[]>>;
    chatMessages: ChatMessageDto[];
    setChatMessages: React.Dispatch<React.SetStateAction<ChatMessageDto[]>>;
    chatRoom: ChatRoomDto | null,
    setChatRoom: React.Dispatch<React.SetStateAction<ChatRoomDto | null>>;
    chatMessage: ChatMessageDto | null;
    setChatMessage: React.Dispatch<React.SetStateAction<ChatMessageDto | null>>;
    tempChatMessages: TempMessage[];
    setTempChatMessages: React.Dispatch<React.SetStateAction<TempMessage[]>>;
}

const initialContext: ChatContextI = {
    chatId: null,
    setChatId: () => {
    },
    chatRooms: [],
    setChatRooms: () => {
    },
    chatMessages: [],
    setChatMessages: () => {
    },
    chatRoom: null,
    setChatRoom: () => {
    },
    chatMessage: null,
    setChatMessage: () => {
    },
    tempChatMessages: [],
    setTempChatMessages: () => {
    }
}

export const ChatContext = createContext<ChatContextI>(initialContext);

export default function ChatProvider({children}: Readonly<{
    children: React.ReactNode
}>): React.ReactElement<ChatContextI> {
    const [chatId, setChatId] = useState<string | null>(null)
    const [chatRooms, setChatRooms] = useState<ChatRoomDto[]>([])
    const [chatMessages, setChatMessages] = useState<ChatMessageDto[]>([])
    const [chatRoom, setChatRoom] = useState<ChatRoomDto | null>(null)
    const [chatMessage, setChatMessage] = useState<ChatMessageDto | null>(null)
    const [tempChatMessages, setTempChatMessages] = useState<TempMessage[]>([])

    const obj: ChatContextI = useMemo(() => ({
        chatId: chatId,
        setChatId: setChatId,
        chatRooms: chatRooms,
        setChatRooms: setChatRooms,
        chatMessages: chatMessages,
        setChatMessages: setChatMessages,
        chatRoom: chatRoom,
        setChatRoom: setChatRoom,
        chatMessage: chatMessage,
        setChatMessage: setChatMessage,
        tempChatMessages: tempChatMessages,
        setTempChatMessages: setTempChatMessages
    }), [chatRooms, chatMessages, chatRoom, chatMessage, tempChatMessages]);

    return (
        <ChatContext.Provider value={obj}>
            {children}
        </ChatContext.Provider>
    );
}