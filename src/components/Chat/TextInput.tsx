import {Box, TextField, IconButton} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import React, {useContext} from 'react';
import {ChatContext, TempMessage} from "../../context/ChatProvider";

interface TextInputProps {
    onClick: (msg: string) => void
}

export const TextInput = (props: TextInputProps) => {
    const {chatRoom, tempChatMessages, setTempChatMessages} = useContext(ChatContext);
    const [tempMessage, setTempMessage] = React.useState<TempMessage>({
        chatId: chatRoom?.chatId ? chatRoom?.chatId : '',
        message: ''
    });

    const handleTextInput = (msg: string) => {
        setTempMessage({
            chatId: chatRoom?.chatId ? chatRoom?.chatId : '',
            message: msg
        })
    }

    const send = () => {
        props.onClick(tempMessage.message)
        setTempMessage({chatId: tempMessage.chatId, message: ""})
    }

    const enter = (e: React.KeyboardEvent<HTMLButtonElement>) => {
        if (e.key === 'Enter') {
            props.onClick(tempMessage.message)
            setTempMessage({chatId: tempMessage.chatId, message: ""})
        }
    }

    return (
        <Box
            sx={{
                bgcolor: 'background.paper',
                boxShadow: 1,
                borderRadius: 1,
                borderColor: '#2d9d92',
                minWidth: 300,
                display: 'flex',
                alignItems: 'end'
            }}
        >
            <TextField
                id="standard-text"
                label="Сообщение"
                maxRows={5}
                multiline={true}
                color="primary"
                sx={{flexGrow: 1}}
                value={tempMessage.message}
                onChange={e => handleTextInput(e.target.value)}
            />
            <IconButton
                aria-label="send"
                size="large"
                sx={{height: '56px', color: '#2d9d92'}}
                onClick={() => send()}
                onKeyDown={e => enter(e)}
            >
                <SendIcon/>
            </IconButton>
        </Box>
    );
};



