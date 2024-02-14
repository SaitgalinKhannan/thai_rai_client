import {Button, ButtonGroup, chakra, Flex, Heading, HStack, useBreakpointValue} from "@chakra-ui/react";
import {Link, useNavigate} from "react-router-dom";
import NavMobile from "./NavMobile";
import {useContext} from "react";
import {ThaiRaiContext} from "../../context/HouseProvider";

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

    const toMainPage = () => {
        resetFilter()
        navigate("/")
    }

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
                                <Button size='sm' variant='solid' onClick={addHouseHandleClick}>Добавить
                                    объявление</Button>
                                <Button size='sm' variant='outline' onClick={loginHandleClick}>Вход</Button>
                            </HStack>
                        </>
                    ) : (
                        <NavMobile/>
                    )
                }
            </Flex>
            {/* <Divider color='telegram.800' w={}='20px' />  */}
        </chakra.header>
    )
}