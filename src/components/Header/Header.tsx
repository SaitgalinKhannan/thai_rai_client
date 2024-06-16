import {
    Button,
    ButtonGroup,
    chakra,
    HStack, Icon, IconButton,
    Image, Menu, MenuButton, MenuItem, MenuList
} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";
import {ThaiRaiContext} from "../../context/HouseProvider";
import logo from "../../assets/images/logo/logohorizontal.png"
import love from "../../assets/images/icons/green_heart.png"
import messages from "../../assets/images/icons/my_messages.png"
import {useTranslation} from "react-i18next";
import Avatar from "../Profile/Avatar";
import {userPhoto} from "../../api/Data";
import {GrLanguage} from "react-icons/gr";
import russia from "../../assets/images/icons/russia.png";
import english from "../../assets/images/icons/english.png";
import thai from "../../assets/images/icons/thai.png";
import china from "../../assets/images/icons/china.png";

export default function Header() {
    let navigate = useNavigate();
    const {resetFilter} = useContext(ThaiRaiContext);
    const {t, i18n} = useTranslation();
    const [lang, setLang] = useState<string>(i18n.language)

    function langName(lang: string) {
        switch (lang) {
            case "ru": {
                return "Русский"
            }
            case "en": {
                return "English"
            }
            case "th": {
                return "แบบไทย"
            }
            case "zh-CN": {
                return "中国人"
            }
            default: {
                return "English"
            }
        }
    }

    useEffect(() => {
        i18n.changeLanguage(lang)
    }, [lang]);

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

    const id = localStorage.getItem('userId')
    const lastName = localStorage.getItem('lastName')
    const firstName = localStorage.getItem('firstName')
    const bio = `${firstName} ${lastName}`

    return (
        <chakra.header id="header" borderBottom='1px solid rgb(0,0,0,0.3)'>
            <HStack w='100%' py='5' justifyContent={"center"}>
                <Image src={logo} height="50px" cursor="pointer" onClick={toMainPage}/>

                <ButtonGroup as='nav' variant='link' marginLeft="20px" spacing='5'>
                    <Button fontSize='18px' onClick={toMainPage} textColor={"#2d9d92"}>{t('main_page')}</Button>
                    <Button fontSize='18px' textColor={"#2d9d92"}>{t('about_us')}</Button>
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
                                <Avatar src={id ? userPhoto(parseInt(id)) : ""} alt={bio} onClick={profileHandleClick}/>
                                {/*<Button
                                    size='sm'
                                    variant='outline'
                                    color={"#2d9d92"}
                                    onClick={profileHandleClick}
                                >
                                    {bio}
                                </Button>*/}
                                <Button
                                    size='sm'
                                    variant='outline'
                                    color={"#2d9d92"}
                                    onClick={toMy}
                                >
                                    {t('my_adv')}
                                </Button>
                                <Button
                                    size='sm'
                                    variant='solid'
                                    backgroundColor={"#2d9d92"}
                                    _hover={{background: "#9cb1b1"}}
                                    onClick={addHouseHandleClick}
                                >
                                    {t('add_adv')}
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    size='sm'
                                    variant='outline'
                                    onClick={loginHandleClick}
                                    color={"#2d9d92"}
                                    _hover={{background: "#9cb1b1"}}
                                >
                                    {t('add_adv')}
                                </Button>
                                <Button
                                    size='sm'
                                    variant='outline'
                                    onClick={loginHandleClick}
                                    color={"#2d9d92"}
                                    _hover={{background: "#9cb1b1"}}
                                >
                                    {t('login')}
                                </Button>
                            </>
                        )
                    }
                </HStack>

                <Menu>
                    <MenuButton
                        as={IconButton}
                        icon={<Icon as={GrLanguage}/>}
                        aria-label='Language'
                        width="32px"
                        height="32px"
                        variant='outline'
                    >
                        {langName(lang)}
                    </MenuButton>
                    <MenuList>
                        <MenuItem minH='48px' onClick={() => setLang("ru")}>
                            <Image
                                boxSize='2rem'
                                borderRadius='full'
                                src={russia}
                                alt='Russian'
                                mr='12px'
                            />
                            <span>Русский</span>
                        </MenuItem>
                        <MenuItem minH='40px' onClick={() => setLang("en")}>
                            <Image
                                boxSize='2rem'
                                borderRadius='full'
                                src={english}
                                alt='English'
                                mr='12px'
                            />
                            <span>English</span>
                        </MenuItem>
                        <MenuItem minH='40px' onClick={() => setLang("th")}>
                            <Image
                                boxSize='2rem'
                                borderRadius='full'
                                src={thai}
                                alt='Thai'
                                mr='12px'
                            />
                            <span>แบบไทย</span>
                        </MenuItem>
                        <MenuItem minH='40px' onClick={() => setLang("zh-CN")}>
                            <Image
                                boxSize='2rem'
                                borderRadius='full'
                                src={china}
                                alt='Chinese'
                                mr='12px'
                            />
                            <span>中国人</span>
                        </MenuItem>
                    </MenuList>
                </Menu>
            </HStack>
        </chakra.header>
    )
}