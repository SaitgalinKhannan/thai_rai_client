import React from 'react';
import {Box} from "@mui/material";
import {ChatMessageDto} from "../../context/ChatProvider";
import {DateTimeFormatter, ZonedDateTime} from "@js-joda/core";

export interface MessageProps {
    message: string,
    timestamp: string,
    photoURL: string,
    displayName: string,
    avatarDisp: boolean,
    isLeft: boolean
}

export const dateTimeFormatter = DateTimeFormatter.ofPattern("HH:mm:ss")

export const MessageLeft = (props: ChatMessageDto) => {
    return (
        <Box display="flex" alignItems="flex-start" maxWidth="90%" mb={2}>
            <Box
                bgcolor="primary.light"
                color="text.primary"
                p={1}
                borderRadius={2}
                position="relative"
                sx={{
                    '&:before': {
                        content: '""',
                        position: 'absolute',
                        left: -7,
                        top: 5,
                        width: 0,
                        height: 0,
                        borderTop: '7px solid transparent',
                        borderRight: '7px solid #7aa8a4',
                        borderBottom: '7px solid transparent',
                    }
                }}
            >
                <Box>{props.content}</Box>
                <Box fontSize="0.75rem" mt={1} textAlign="right">
                    {ZonedDateTime.parse(props.zonedDateTime.toString()).format(dateTimeFormatter)}
                </Box>
            </Box>
        </Box>
    );
};

export const MessageRight = (props: ChatMessageDto) => {
    return (
        <Box display="flex" justifyContent="flex-end" mb={2}>
            <Box
                bgcolor="secondary.main"
                color="text.primary"
                p={1}
                borderRadius={2}
                position="relative"
                sx={{
                    '&:before': {
                        content: '""',
                        position: 'absolute',
                        right: -7,
                        top: 5,
                        width: 0,
                        height: 0,
                        borderTop: '7px solid transparent',
                        borderLeft: '7px solid #8bc1bc',
                        borderBottom: '7px solid transparent',
                    },
                    marginLeft: '10%'
                }}
            >
                <Box>{props.content}</Box>
                <Box fontSize="0.75rem" mt={1} textAlign="right">
                    {ZonedDateTime.parse(props.zonedDateTime.toString()).format(dateTimeFormatter)}
                </Box>
            </Box>
        </Box>
    );
};