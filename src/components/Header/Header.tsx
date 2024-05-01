import {
    Button,
    ButtonGroup,
    chakra,
    Flex,
    HStack,
    Image
} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";
import React, {useContext} from "react";
import {ThaiRaiContext} from "../../context/HouseProvider";
import logo from "../../assets/images/logo/logohorizontal.png"
import love from "../../assets/images/icons/green_heart.png"
import messages from "../../assets/images/icons/my_messages.png"

export default function Header() {
    let navigate = useNavigate();
    const {resetFilter} = useContext(ThaiRaiContext);

    const addHouseHandleClick = () => {
        navigate("/add-house");
    }

    const loginHandleClick = () => {
        navigate("/signin")
    }

    const profileHandleClick = () => {
        navigate("/profile")
    }

    const toMy = () => {
        navigate("/my")
    }

    const toMainPage = () => {
        resetFilter()
        navigate("/")
    }

    const favoritesHandleClick = () => {
        navigate("/favorites");
    }

    const messagesHandleClick = () => {
        navigate("/chats");
    }

    let lastName = localStorage.getItem('lastName')
    let firstName = localStorage.getItem('firstName')
    let bio = `${firstName} ${lastName}`

    return (
        <chakra.header id="header" borderBottom='1px solid rgb(0,0,0,0.3)'>
            <Flex w='100%' py='5' align='center' justify='space-around'>
                {
                    <>
                        <Image src={logo} height="50px" cursor="pointer" onClick={toMainPage}/>

                        <ButtonGroup as='nav' variant='link' spacing='5'>
                            <Button fontSize='18px' onClick={toMainPage} textColor={"#2d9d92"}>Главная страница</Button>
                            <Button fontSize='18px' textColor={"#2d9d92"}>О нас</Button>
                        </ButtonGroup>

                        <HStack marginLeft="20px">
                            {
                                localStorage.getItem('accessToken') !== null ? (
                                    <>
                                        <Image
                                            src={messages}
                                            width={"20px"}
                                            height={"20px"}
                                            cursor="pointer"
                                            onClick={messagesHandleClick}
                                        />
                                        <Image
                                            src={love}
                                            width={"20px"}
                                            height={"20px"}
                                            cursor="pointer"
                                            onClick={favoritesHandleClick}
                                        />
                                        <Button
                                            size='sm'
                                            variant='outline'
                                            color={"#2d9d92"}
                                            onClick={profileHandleClick}
                                        >
                                            {bio}
                                        </Button>
                                        <Button
                                            size='sm'
                                            variant='outline'
                                            color={"#2d9d92"}
                                            onClick={toMy}
                                        >
                                            Мои объявления
                                        </Button>
                                        <Button
                                            size='sm'
                                            variant='solid'
                                            backgroundColor={"#2d9d92"}
                                            _hover={{background: "#9cb1b1"}}
                                            onClick={addHouseHandleClick}
                                        >
                                            Добавить объявление
                                        </Button>
                                    </>
                                ) : (
                                    <Button
                                        size='sm'
                                        variant='outline'
                                        onClick={loginHandleClick}
                                        color={"#2d9d92"}
                                        _hover={{background: "#9cb1b1"}}
                                    >
                                        Вход
                                    </Button>
                                )
                            }
                        </HStack>
                    </>
                }
            </Flex>
        </chakra.header>
    )
}