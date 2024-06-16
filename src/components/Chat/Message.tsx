import React from 'react';
import {Box} from "@mui/material";
import {ChatMessageDto} from "../../context/ChatProvider";
import {DateTimeFormatter, ZonedDateTime} from "@js-joda/core";
import {Button} from "@chakra-ui/react";
import {useTranslation} from "react-i18next";

export interface MessageProps {
    chatMessage: ChatMessageDto,
    onContextMenu: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

export interface MobileMessageProps {
    chatMessage: ChatMessageDto,
    onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

export const dateTimeFormatter = DateTimeFormatter.ofPattern("HH:mm:ss")

export const MessageLeft = (props: MessageProps) => {
    return (
        <Box display="flex" alignItems="flex-start" mb={2} onContextMenu={e => props.onContextMenu(e)}>
            <Box
                bgcolor="primary.light"
                color="text.primary"
                p={1}
                borderRadius={2}
                position="relative"
                maxWidth="90%"
                sx={{
                    "&:after": {
                        content: "''",
                        position: "absolute",
                        width: "0",
                        height: "0",
                        borderTop: "15px solid #7aa8a4",
                        borderLeft: "15px solid transparent",
                        borderRight: "15px solid transparent",
                        top: "0",
                        left: "-15px"
                    },
                    /*"&:before": {
                        content: "''",
                        position: "absolute",
                        width: "0",
                        height: "0",
                        borderTop: "17px solid #7aa8a4",
                        borderLeft: "16px solid transparent",
                        borderRight: "16px solid transparent",
                        top: "0px",
                        left: "-15px"
                    }*/
                }}
            >
                <Box sx={{wordWrap: "break-word"}}>{props.chatMessage.content}</Box>
                <Box fontSize="0.75rem" mt={1} textAlign="right">
                    {ZonedDateTime.parse(props.chatMessage.zonedDateTime.toString()).format(dateTimeFormatter)}
                </Box>
            </Box>
        </Box>
    );
};

export const MessageRight = (props: MessageProps) => {
    return (
        <Box display="flex" justifyContent="flex-end" mb={2} onContextMenu={e => props.onContextMenu(e)}>
            <Box
                bgcolor="secondary.main"
                color="text.primary"
                p={1}
                borderRadius={2}
                position="relative"
                maxWidth="90%"
                sx={{
                    "&:after": {
                        content: "''",
                        position: "absolute",
                        width: "0",
                        height: "0",
                        borderTop: "15px solid #8bc1bc",
                        borderLeft: "15px solid transparent",
                        borderRight: "15px solid transparent",
                        top: "0",
                        right: "-15px"
                    },
                    /*"&:before": {
                        content: "''",
                        position: "absolute",
                        width: "0",
                        height: "0",
                        borderTop: "17px solid #8bc1bc",
                        borderLeft: "16px solid transparent",
                        borderRight: "16px solid transparent",
                        top: "0px",
                        right: "-15px"
                    },*/
                    marginLeft: '10%'
                }}
            >
                <Box sx={{wordWrap: "break-word"}}>{props.chatMessage.content}</Box>
                <Box fontSize="0.75rem" mt={1} textAlign="right">
                    {ZonedDateTime.parse(props.chatMessage.zonedDateTime.toString()).format(dateTimeFormatter)}
                </Box>
            </Box>
        </Box>
    );
};

export const MobileMessageLeft = (props: MobileMessageProps) => {
    return (
        <Box display="flex" alignItems="flex-start" mb={2} onClick={e => {
            props.onClick(e)
            console.log(e.pageY)
        }}>
            <Box
                bgcolor="primary.light"
                color="text.primary"
                p={1}
                borderRadius={2}
                position="relative"
                maxWidth="90%"
                sx={{
                    "&:after": {
                        content: "''",
                        position: "absolute",
                        width: "0",
                        height: "0",
                        borderTop: "15px solid #7aa8a4",
                        borderLeft: "15px solid transparent",
                        borderRight: "15px solid transparent",
                        top: "0",
                        left: "-15px"
                    },
                    /*"&:before": {
                        content: "''",
                        position: "absolute",
                        width: "0",
                        height: "0",
                        borderTop: "17px solid #7aa8a4",
                        borderLeft: "16px solid transparent",
                        borderRight: "16px solid transparent",
                        top: "0px",
                        left: "-15px"
                    }*/
                }}
            >
                <Box sx={{wordWrap: "break-word"}}>{props.chatMessage.content}</Box>
                <Box fontSize="0.75rem" mt={1} textAlign="right">
                    {ZonedDateTime.parse(props.chatMessage.zonedDateTime.toString()).format(dateTimeFormatter)}
                </Box>
            </Box>
        </Box>
    );
};

export const MobileMessageRight = (props: MobileMessageProps) => {
    return (
        <Box display="flex" justifyContent="flex-end" mb={2} onClick={e => {
            props.onClick(e)
            console.log(e)
        }}>
            <Box
                bgcolor="secondary.main"
                color="text.primary"
                p={1}
                borderRadius={2}
                position="relative"
                maxWidth="90%"
                sx={{
                    "&:after": {
                        content: "''",
                        position: "absolute",
                        width: "0",
                        height: "0",
                        borderTop: "15px solid #8bc1bc",
                        borderLeft: "15px solid transparent",
                        borderRight: "15px solid transparent",
                        top: "0",
                        right: "-15px"
                    },
                    /*"&:before": {
                        content: "''",
                        position: "absolute",
                        width: "0",
                        height: "0",
                        borderTop: "17px solid #8bc1bc",
                        borderLeft: "16px solid transparent",
                        borderRight: "16px solid transparent",
                        top: "0px",
                        right: "-15px"
                    },*/
                    marginLeft: '10%'
                }}
            >
                <Box sx={{wordWrap: "break-word"}}>{props.chatMessage.content}</Box>
                <Box fontSize="0.75rem" mt={1} textAlign="right">
                    {ZonedDateTime.parse(props.chatMessage.zonedDateTime.toString()).format(dateTimeFormatter)}
                </Box>
            </Box>
        </Box>
    );
};

export interface ContextMenuProps {
    message: ChatMessageDto,
    isMessageLeft: boolean,
    top: number,
    left: number,
    copyTextToClipboard: (text: string) => void,
    updateMessage: () => void,
    deleteMessage: () => void
}

export const ContextMenu = (props: ContextMenuProps) => {
    const {t} = useTranslation();

    return (
        <Box width="194px" sx={{
            position: "absolute",
            direction: "row",
            backgroundColor: "#f9fdf8",
            borderRadius: "5px",
            top: props.top,
            left: props.isMessageLeft ? props.left : props.left - 150,
            zIndex: 1
        }}>
            <Button
                sx={{
                    width: "184px",
                    height: "32px",
                    marginX: "5px",
                    paddingX: "12px",
                    paddingY: "4px",
                    backgroundColor: "#f9fdf8",
                    fontSize: "14px",
                    border: 0,
                    textAlign: "left",
                    _hover: {background: "#f2f2f2", borderRadius: "5px"}
                }}
                onClick={() => props.copyTextToClipboard(props.message.content)}
            >
                {t('copy')}
            </Button>
            {
                !props.isMessageLeft && <>
                    {/*<Button
                        sx={{
                            width: "184px",
                            height: "32px",
                            marginX: "5px",
                            paddingX: "12px",
                            paddingY: "4px",
                            backgroundColor: "#f9fdf8",
                            fontSize: "14px",
                            border: 0,
                            _hover: {background: "#f2f2f2", borderRadius: "5px"}
                        }}
                        onClick={() => {}}
                    >
                        {t('change')}
                    </Button>*/}
                    <Button
                        sx={{
                            width: "184px",
                            height: "32px",
                            marginX: "5px",
                            paddingX: "12px",
                            paddingY: "4px",
                            backgroundColor: "#f9fdf8",
                            fontSize: "14px",
                            border: 0,
                            textAlign: "left",
                            _hover: {background: "#f2f2f2", borderRadius: "5px"}
                        }}
                        onClick={() => props.deleteMessage()}
                    >
                        {t('delete')}
                    </Button>
                </>
            }
        </Box>
    )
}

export const MobileContextMenu = (props: ContextMenuProps) => {
    const {t} = useTranslation();

    return (
        <Box width="194px" sx={{
            position: "absolute",
            direction: "row",
            backgroundColor: "#f9fdf8",
            borderRadius: "5px",
            top: props.top,
            left: props.isMessageLeft ? props.left : props.left,
            zIndex: 5
        }}>
            <Button
                sx={{
                    width: "184px",
                    height: "32px",
                    marginX: "5px",
                    paddingX: "12px",
                    paddingY: "4px",
                    backgroundColor: "#f9fdf8",
                    fontSize: "14px",
                    border: 0,
                    textAlign: "left",
                    _hover: {background: "#f2f2f2", borderRadius: "5px"}
                }}
                onClick={() => props.copyTextToClipboard(props.message.content)}
            >
                {t('copy')}
            </Button>
            {
                !props.isMessageLeft && <>
                    {/*<Button
                        sx={{
                            width: "184px",
                            height: "32px",
                            marginX: "5px",
                            paddingX: "12px",
                            paddingY: "4px",
                            backgroundColor: "#f9fdf8",
                            fontSize: "14px",
                            border: 0,
                            _hover: {background: "#f2f2f2", borderRadius: "5px"}
                        }}
                    >
                        {t('change')}
                    </Button>*/}
                    <Button
                        sx={{
                            width: "184px",
                            height: "32px",
                            marginX: "5px",
                            paddingX: "12px",
                            paddingY: "4px",
                            backgroundColor: "#f9fdf8",
                            fontSize: "14px",
                            border: 0,
                            textAlign: "left",
                            _hover: {background: "#f2f2f2", borderRadius: "5px"}
                        }}
                    >
                        {t('delete')}
                    </Button>
                </>
            }
        </Box>
    )
}