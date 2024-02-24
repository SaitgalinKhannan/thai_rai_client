import {Button, ButtonGroup, chakra, Flex, Heading, HStack, useBreakpointValue} from "@chakra-ui/react";
import {Link, useNavigate} from "react-router-dom";
import React, {useContext} from "react";
import {ThaiRaiContext} from "../../context/HouseProvider";
import {Role} from "../../api/model";

export default function Header() {
    const isDesktop = useBreakpointValue({base: false, lg: true})
    let navigate = useNavigate();
    const {resetFilter} = useContext(ThaiRaiContext);

    const addHouseHandleClick = () => {
        navigate("/add-house");
    }

    const loginHandleClick = () => {
        navigate("/login/signin")
    }

    const profileHandleClick = () => {
        navigate("/profile")
    }

    const toMainPage = () => {
        resetFilter()
        navigate("/")
    }

    let lastName = localStorage.getItem('lastName')
    let firstName = localStorage.getItem('firstName')
    let bio = `${firstName} ${lastName}`

    return (
        <chakra.header id="header" borderBottom='1px solid rgb(0,0,0,0.3)'>
            <Flex w='100%' py='5' align='center' justify='space-between'>
                <Link to='/'>
                    <Heading fontSize='3xl' color='telegram.700' onClick={resetFilter}>Thai Rai</Heading>
                </Link>
                {
                    isDesktop ? (
                        <>
                            <ButtonGroup as='nav' variant='link' spacing='5'>
                                <Button fontSize='16px' onClick={toMainPage}>Главная страница</Button>
                                <Button fontSize='16px'>О нас</Button>
                            </ButtonGroup>

                            <HStack>
                                {
                                    localStorage.getItem('accessToken') && localStorage.getItem('role') === Role.ADMIN ? (
                                        <>
                                            <Button size='sm' variant='outline' onClick={profileHandleClick}>{bio}</Button>
                                            <Button size='sm' variant='solid' onClick={addHouseHandleClick}>Добавить объявление</Button>
                                        </>
                                    ) : localStorage.getItem('accessToken') ? (
                                        <Button size='sm' variant='outline' onClick={profileHandleClick}>{bio}</Button>
                                    ) : (
                                        <Button size='sm' variant='outline' onClick={loginHandleClick}>Вход</Button>
                                    )
                                }
                            </HStack>

                        </>
                    ) : (
                        <></>
                    )
                }
            </Flex>
        </chakra.header>
    )
}