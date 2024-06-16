import React from 'react';
import {Avatar, Box, Typography} from "@mui/material";
import profile from "../../assets/images/agents/profile.png";
import {UserWithoutPassword} from "../../api/model";
import {userPhoto} from "../../api/Data";

export interface ChatRoomDto {
    id: number;
    chatId: string;
    sender: UserWithoutPassword;
    recipient: UserWithoutPassword;
}

export interface ChatRoomProps {
    chatRoom: ChatRoomDto;
    backgroundColor: string,
    textColor: string
}

export const ChatRoom = (props: ChatRoomProps) => {
    return (
        <Box
            sx={{
                bgcolor: props.backgroundColor,
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                height: '50px',
            }}
        >
            <Avatar
                alt={""}
                src={props.chatRoom.recipient.id ? userPhoto(props.chatRoom.recipient.id) : profile}
                sx={{
                    bgcolor: 'black',
                    color: 'text.primary',
                    width: '48px',
                    height: '48px'
                }}
            />
            <Box>
                <Typography variant="h1" component="h2" fontWeight="fontWeightBold" fontSize="20px"
                            sx={{margin: '0px 0px 0px 16px', color: props.textColor}}>
                    {`${props.chatRoom.recipient.firstName} ${props.chatRoom.recipient.lastName}`}
                </Typography>
                <Typography variant="body1" fontSize="16px"
                            sx={{
                                margin: '0px 0px 0px 16px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitBoxOrient: 'vertical',
                                WebkitLineClamp: 1,
                                color: props.textColor
                            }}
                >
                    Hello everyone! How about meeting next Monday or Wednesday?
                </Typography>
            </Box>
        </Box>
    );
};