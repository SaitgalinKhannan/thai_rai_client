import {
    Button,
    Center,
    Drawer, DrawerBody,
    DrawerCloseButton,
    DrawerContent, DrawerHeader,
    DrawerOverlay,
    IconButton,
    useDisclosure, VStack
} from "@chakra-ui/react";
import {FiMenu} from "react-icons/fi";
import {useContext, useRef} from 'react';
import {useNavigate} from "react-router-dom";
import {ThaiRaiContext} from "../../context/HouseProvider";
import {Role} from "../../api/model";


export default function NavMobile() {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const btnRef = useRef<HTMLButtonElement>(null);
    const navigate = useNavigate();
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

    const toMainPage = () => {
        resetFilter()
        navigate("/")
    }

    return (
        <>
            <IconButton variant='ghost'
                        icon={<FiMenu fontSize='1.35rem'/>}
                        aria-label='Open Menu'
                        onClick={onOpen} ref={btnRef}
            />
            <Drawer isOpen={isOpen} placement='right' onClose={onClose} finalFocusRef={btnRef}>
                <DrawerOverlay/>
                <DrawerContent>
                    <DrawerCloseButton/>
                    <Center>
                        <DrawerHeader>Меню</DrawerHeader>
                    </Center>
                    <DrawerBody px='14' mt='4'>
                        <VStack as='nav' spacing='8' alignItems='left'>
                            <Button size='sm' variant='solid' onClick={toMainPage}>Главная страница</Button>
                            <Button size='sm' variant='solid'>О нас</Button>
                            {
                                localStorage.getItem('accessToken') && localStorage.getItem('role') === Role.ADMIN ? (
                                    <>
                                        <Button size='sm' variant='solid' onClick={addHouseHandleClick}>Добавить объявление</Button>
                                        <Button size='sm' variant='outline' onClick={profileHandleClick}>Профиль</Button>
                                    </>
                                ) : localStorage.getItem('accessToken') ? (
                                    <Button size='sm' variant='outline' onClick={profileHandleClick}>Профиль</Button>
                                ) : (
                                    <Button size='sm' variant='outline' onClick={loginHandleClick}>Вход</Button>
                                )
                            }
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}