import React, {useState} from "react";
import {
    Flex,
    Input,
    Button,
    InputGroup,
    Stack,
    InputLeftElement,
    Box,
    FormControl,
    InputRightElement, useToast, ToastId
} from "@chakra-ui/react";
import {FaUserAlt, FaLock} from "react-icons/fa";
import {ViewIcon, ViewOffIcon} from "@chakra-ui/icons";
import {authUser, registerUser} from "../../api/Data";
import {useNavigate} from "react-router-dom";
import {Role, UserDto} from "../../api/model";
import {useTranslation} from "react-i18next";

export default function SignUp() {
    const {t} = useTranslation();
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
                title: t('enter_name'),
                status: 'error',
                duration: 500,
                isClosable: true,
                position: 'top'
            })
            return
        }

        if (lastName === "") {
            toast({
                title: t('enter_lastname'),
                status: 'error',
                duration: 500,
                isClosable: true,
                position: 'top'
            })
            return
        }

        if (email === "") {
            toast({
                title: t('enter_email'),
                status: 'error',
                duration: 500,
                isClosable: true,
                position: 'top'
            })
            return
        }

        if (phone === "") {
            toast({
                title: t('enter_phone'),
                status: 'error',
                duration: 500,
                isClosable: true,
                position: 'top'
            })
            return
        }

        if (password === "") {
            toast({
                title: t('enter_pass'),
                status: 'error',
                duration: 500,
                isClosable: true,
                position: 'top'
            })
            return
        }

        if (passwordConfirmation === "") {
            toast({
                title: t('enter_pass_again'),
                status: 'error',
                duration: 500,
                isClosable: true,
                position: 'top'
            })
            return
        }

        if (passwordConfirmation !== password) {
            toast({
                title: t('pass_eq'),
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
            title: t('loading'),
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
                        localStorage.setItem('photoUrl', user.photoUrl)
                    }

                    if (toastIdRef.current) {
                        toast.update(toastIdRef.current, {
                            title: t('sign_up_success'),
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
                        title: t('sign_up_error'),
                        description: t('the_mailing_address_is_already_registered'),
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
                                    <InputLeftElement pointerEvents="none">
                                        <FaUserAlt color="#2d9d92"/>
                                    </InputLeftElement>
                                    <Input
                                        type="lastname"
                                        placeholder={t('lastname')}
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
                                        <FaUserAlt color="#2d9d92"/>
                                    </InputLeftElement>
                                    <Input
                                        type="firstname"
                                        placeholder={t('first_name')}
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
                                        <FaUserAlt color="#2d9d92"/>
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
                                        <FaUserAlt color="#2d9d92"/>
                                    </InputLeftElement>
                                    <Input
                                        type="phone"
                                        placeholder={t('phone_number')}
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
                                        <FaLock color="#2d9d92"/>
                                    </InputLeftElement>
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder={t('password')}
                                        value={password}
                                        onChange={e => {
                                            setPassword(e.target.value)
                                        }}
                                    />
                                    <InputRightElement width="4.5rem">
                                        <Button
                                            h="1.75rem"
                                            onClick={handleShowClick}
                                            backgroundColor={"#2d9d92"}
                                            _hover={{background: "#9cb1b1"}}
                                        >
                                            {showPassword ? <ViewOffIcon/> : <ViewIcon/>}
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
                            </FormControl>
                            <FormControl>
                                <InputGroup>
                                    <InputLeftElement pointerEvents="none">
                                        <FaLock color="#2d9d92"/>
                                    </InputLeftElement>
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder={t('password_confirmation')}
                                        value={passwordConfirmation}
                                        onChange={e => {
                                            setPasswordConfirmation(e.target.value)
                                        }}
                                    />
                                    <InputRightElement width="4.5rem">
                                        <Button
                                            h="1.75rem"
                                            onClick={handleShowClick}
                                            backgroundColor={"#2d9d92"}
                                            _hover={{background: "#9cb1b1"}}
                                        >
                                            {showPassword ? <ViewOffIcon/> : <ViewIcon/>}
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
                            </FormControl>
                            <Button
                                backgroundColor={"#2d9d92"}
                                onClick={signUpHandleClick}
                                _hover={{background: "#9cb1b1"}}
                            >
                                {t('register')}
                            </Button>
                        </Stack>
                    </form>
                </Box>
            </Stack>
        </Flex>
    );
};
