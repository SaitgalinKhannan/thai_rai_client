import React, {useState} from "react";
import {
    Flex,
    Input,
    Button,
    InputGroup,
    Stack,
    InputLeftElement,
    chakra,
    Box,
    Link,
    FormControl,
    InputRightElement, useToast, ToastId, HStack, Text
} from "@chakra-ui/react";
import {FaUserAlt, FaLock} from "react-icons/fa";
import {ViewIcon, ViewOffIcon} from "@chakra-ui/icons";
import {authUser, userByEmail} from "../../api/Data";
import {useNavigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

const SignIn = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const toast = useToast()
    const toastIdRef = React.useRef<ToastId>()

    const handleShowClick = () => setShowPassword(!showPassword);

    const loginUser = async (email: string, password: string) => {
        try {
            const response = await authUser(email, password)
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);
            const decodedJwt = jwtDecode(response.accessToken);
            if (decodedJwt.sub != null) {
                await userByEmail(decodedJwt.sub, response.accessToken).then(user => {
                    localStorage.setItem('userId', user.id.toString());
                    localStorage.setItem('firstName', user.firstName);
                    localStorage.setItem('lastName', user.lastName);
                    localStorage.setItem('email', user.email);
                    localStorage.setItem('password', password);
                    localStorage.setItem('phone', user.phone);
                    localStorage.setItem('role', user.role);

                    if (toastIdRef.current) {
                        toast.update(toastIdRef.current, {
                            title: 'Вход выполнен',
                            status: 'success',
                            duration: 1000,
                            isClosable: true,
                            position: 'top'
                        })
                    }
                    navigate("/")
                }).catch(e => {
                    throw e
                })
            }
        } catch (error) {
            console.log(error)
            if (toastIdRef.current) {
                toast.update(toastIdRef.current, {
                    title: 'Не удалось войти',
                    description: "Неправильный логин или пароль",
                    status: 'error',
                    duration: 1000,
                    isClosable: true,
                    position: 'top'
                })
            }
        }
    };

    const loginButtonHandle = async () => {
        if (email.trim() === '') {
            toast({
                title: 'Введите логин!',
                status: 'error',
                duration: 500,
                isClosable: true,
                position: 'top'
            })
            return;
        }

        if (password.trim() === '') {
            toast({
                title: 'Введите пароль!',
                status: 'error',
                duration: 500,
                isClosable: true,
                position: 'top'
            })
            return;
        }

        toastIdRef.current = toast({
            title: 'Загрузка',
            status: 'loading',
            isClosable: true,
            position: 'top'
        })

        await loginUser(email, password);
    }


    return (
        <Flex
            flexDirection="column"
            width="100wh"
            height="85vh"
            justifyContent="center"
            alignItems="center"
        >
            <Stack
                flexDir="column"
                mb="2"
                justifyContent="center"
                alignItems="center"
            >
                <Box minW={{base: "90%", lg: "468px"}}>
                    <form>
                        <Stack
                            spacing={4}
                            p="1rem"
                            backgroundColor="whiteAlpha.900"
                            boxShadow="md"
                        >
                            <FormControl>
                                <InputGroup>
                                    <InputLeftElement
                                        pointerEvents="none"
                                    >
                                        <CFaUserAlt color="#2d9d92"/>
                                    </InputLeftElement>
                                    <Input type="email"
                                           placeholder="Email"
                                           value={email}
                                           onChange={it => setEmail(it.target.value)}
                                    />
                                </InputGroup>
                            </FormControl>
                            <FormControl>
                                <InputGroup>
                                    <InputLeftElement
                                        pointerEvents="none">
                                        <CFaLock color="#2d9d92"/>
                                    </InputLeftElement>
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Пароль"
                                        value={password}
                                        onChange={it => setPassword(it.target.value)}
                                    />
                                    <InputRightElement width="4.5rem">
                                        <Button
                                            h="1.75rem"
                                            backgroundColor={"#2d9d92"}
                                            onClick={handleShowClick}
                                            _hover={{background: "#9cb1b1"}}
                                        >
                                            {showPassword ? <ViewOffIcon/> : <ViewIcon/>}
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
                                {/*<FormHelperText textAlign="right">
                                    <Link>Забыли пароль?</Link>
                                </FormHelperText>*/}
                            </FormControl>
                            <Button
                                backgroundColor={"#2d9d92"}
                                onClick={loginButtonHandle}
                                _hover={{background: "#9cb1b1"}}
                            >
                                Войти
                            </Button>
                        </Stack>
                    </form>
                </Box>
            </Stack>
            <HStack spacing={0}>
                <Text>Нет аккаунта?{" "}</Text>
                <Button
                    variant={"text"}
                    color={"#2d9d92"}
                    onClick={() => navigate("/new-account")}
                >
                    Регистрация
                </Button>
            </HStack>
        </Flex>
    );
};

export default SignIn;
