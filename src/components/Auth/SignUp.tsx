import React, {useState} from "react";
import {
    Box,
    Button,
    chakra,
    Flex,
    FormControl,
    Heading,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    Stack,
    ToastId,
    useToast
} from "@chakra-ui/react";
import {FaLock, FaUserAlt} from "react-icons/fa";
import {ViewIcon, ViewOffIcon} from "@chakra-ui/icons";
import {authUser, registerUser} from "../../api/Data";
import {Role, UserDto} from "../../api/model";
import {useNavigate} from "react-router-dom";

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

const SignUp = () => {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirmation, setPasswordConfirmation] = useState("")
    const [showPassword, setShowPassword] = useState(false);
    const toast = useToast();
    const toastIdRef = React.useRef<ToastId>()
    const navigate = useNavigate();
    const handleShowClick = () => setShowPassword(!showPassword);

    const signUpHandleClick = async () => {
        if (firstName === "") {
            toast({
                title: 'Введите имя!',
                status: 'error',
                duration: 500,
                isClosable: true,
                position: 'top'
            })
            return
        }

        if (lastName === "") {
            toast({
                title: 'Введите фамилию!',
                status: 'error',
                duration: 500,
                isClosable: true,
                position: 'top'
            })
            return
        }

        if (email === "") {
            toast({
                title: 'Введите почтовый адрес!',
                status: 'error',
                duration: 500,
                isClosable: true,
                position: 'top'
            })
            return
        }

        if (phone === "") {
            toast({
                title: 'Введите номер телефона!',
                status: 'error',
                duration: 500,
                isClosable: true,
                position: 'top'
            })
            return
        }

        if (password === "") {
            toast({
                title: 'Введите пароль!',
                status: 'error',
                duration: 500,
                isClosable: true,
                position: 'top'
            })
            return
        }

        if (passwordConfirmation === "") {
            toast({
                title: 'Введите пароль еще раз!',
                status: 'error',
                duration: 500,
                isClosable: true,
                position: 'top'
            })
            return
        }

        if (passwordConfirmation !== password) {
            toast({
                title: 'Пароли должны совпадать!',
                status: 'error',
                duration: 500,
                isClosable: true,
                position: 'top'
            })
            return
        }

        let user: UserDto = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            password: password,
            role: Role.USER,
            photoUrl: null
        }

        toastIdRef.current = toast({
            title: 'Загрузка',
            status: 'loading',
            isClosable: true,
            position: 'top'
        })

        await registerUser(user)
            .then(async user => {
                await authUser(user.email, password).then(tokens => {
                    localStorage.setItem('accessToken', tokens.accessToken);
                    localStorage.setItem('refreshToken', tokens.refreshToken);

                    localStorage.setItem('userId', user.id.toString());
                    localStorage.setItem('firstName', user.firstName);
                    localStorage.setItem('lastName', user.lastName);
                    localStorage.setItem('email', user.email);
                    localStorage.setItem('phone', user.phone);
                    localStorage.setItem('role', user.role);
                    if (user.photoUrl != null) {
                        localStorage.setItem('photoUrl',  user.photoUrl)
                    }

                    if (toastIdRef.current) {
                        toast.update(toastIdRef.current, {
                            title: 'Регистрация успешно пройдена!',
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
            }).catch(e => {
                console.log(e)
                if (toastIdRef.current) {
                    toast.update(toastIdRef.current, {
                        title: 'Не удалось зарегестрироваться!',
                        description: "Пользователь с таким почтовым адресом уже существует.",
                        status: 'error',
                        duration: 1000,
                        isClosable: true,
                        position: 'top'
                    })
                }
            })
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
                <Box minW={{base: "90%", md: "468px"}}>
                    <form>
                        <Stack
                            spacing={4}
                            p="1rem"
                            backgroundColor="whiteAlpha.900"
                            boxShadow="md"
                        >
                            <FormControl>
                                <InputGroup>
                                    <InputLeftElement pointerEvents="none">
                                        <CFaUserAlt color="telegram.500"/>
                                    </InputLeftElement>
                                    <Input
                                        type="lastname"
                                        placeholder="Фамилия"
                                        value={lastName}
                                        onChange={e => {
                                            setLastName(e.target.value)
                                        }}
                                    />
                                </InputGroup>
                            </FormControl>
                            <FormControl>
                                <InputGroup>
                                    <InputLeftElement pointerEvents="none">
                                        <CFaUserAlt color="telegram.500"/>
                                    </InputLeftElement>
                                    <Input
                                        type="firstname"
                                        placeholder="Имя"
                                        value={firstName}
                                        onChange={e => {
                                            setFirstName(e.target.value)
                                        }}
                                    />
                                </InputGroup>
                            </FormControl>
                            <FormControl>
                                <InputGroup>
                                    <InputLeftElement pointerEvents="none">
                                        <CFaUserAlt color="telegram.500"/>
                                    </InputLeftElement>
                                    <Input
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={e => {
                                            setEmail(e.target.value)
                                        }}
                                    />
                                </InputGroup>
                            </FormControl>
                            <FormControl>
                                <InputGroup>
                                    <InputLeftElement pointerEvents="none">
                                        <CFaUserAlt color="telegram.500"/>
                                    </InputLeftElement>
                                    <Input
                                        type="phone"
                                        placeholder="Номер телефона"
                                        value={phone}
                                        onChange={e => {
                                            setPhone(e.target.value)
                                        }}
                                    />
                                </InputGroup>
                            </FormControl>
                            <FormControl>
                                <InputGroup>
                                    <InputLeftElement pointerEvents="none">
                                        <CFaLock color="telegram.500"/>
                                    </InputLeftElement>
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Пароль"
                                        value={password}
                                        onChange={e => {
                                            setPassword(e.target.value)
                                        }}
                                    />
                                    <InputRightElement width="4.5rem">
                                        <Button h="1.75rem" onClick={handleShowClick}>
                                            {showPassword ? <ViewOffIcon/> : <ViewIcon/>}
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
                            </FormControl>
                            <FormControl>
                                <InputGroup>
                                    <InputLeftElement pointerEvents="none">
                                        <CFaLock color="telegram.500"/>
                                    </InputLeftElement>
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Потверждение пароля"
                                        value={passwordConfirmation}
                                        onChange={e => {
                                            setPasswordConfirmation(e.target.value)
                                        }}
                                    />
                                    <InputRightElement width="4.5rem">
                                        <Button h="1.75rem" onClick={handleShowClick}>
                                            {showPassword ? <ViewOffIcon/> : <ViewIcon/>}
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
                            </FormControl>
                            <Button onClick={signUpHandleClick}>Зарегистрироваться</Button>
                        </Stack>
                    </form>
                </Box>
            </Stack>
        </Flex>
    );
};

export default SignUp;
