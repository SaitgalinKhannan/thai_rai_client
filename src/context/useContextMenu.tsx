import {useState, useEffect} from "react";
import {ChatMessageDto} from "./ChatProvider";

const useContextMenu = () => {
    const [clicked, setClicked] = useState(false);
    const [points, setPoints] = useState({
        x: 0,
        y: 0,
    });
    const [message, setMessage] = useState<ChatMessageDto | null>(null)
    const [isMessageLeft, setIsMessageLeft] = useState(false)

    useEffect(() => {
        const handleClick = () => setClicked(false);
        document.addEventListener("click", handleClick);
        return () => {
            document.removeEventListener("click", handleClick);
        };
    }, []);

    return {
        clicked,
        setClicked,
        points,
        setPoints,
        message,
        setMessage,
        isMessageLeft,
        setIsMessageLeft
    };
};

export default useContextMenu;