import React, {useState} from "react";
import {
    Flex,
    Heading,
    Input,
    Button,
    InputGroup,
    Stack,
    InputLeftElement,
    chakra,
    Box,
    Link,
    FormControl,
    FormHelperText,
    InputRightElement
} from "@chakra-ui/react";
import {FaUserAlt, FaLock} from "react-icons/fa";
import {ViewIcon, ViewOffIcon} from "@chakra-ui/icons";

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

const SignIn = () => {
    const [showPassword, setShowPassword] = useState(false);

    const handleShowClick = () => setShowPassword(!showPassword);

    return (
        <Flex
            flexDirection="column"
            width="100wh"
            height="100vh"
            justifyContent="center"
            alignItems="center"
        >
            <Stack
                flexDir="column"
                mb="2"
                justifyContent="center"
                alignItems="center"
            >
                <Heading color="telegram.500">Thai Rai</Heading>
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
                                    <InputLeftElement
                                        pointerEvents="none"
                                    >
                                        <CFaUserAlt color="telegram.500"/>
                                    </InputLeftElement>
                                    <Input type="email" placeholder="Email"/>
                                </InputGroup>
                            </FormControl>
                            <FormControl>
                                <InputGroup>
                                    <InputLeftElement
                                        pointerEvents="none">
                                        <CFaLock color="telegram.500"/>
                                    </InputLeftElement>
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Пароль"
                                    />
                                    <InputRightElement width="4.5rem">
                                        <Button h="1.75rem" onClick={handleShowClick}>
                                            {showPassword ? <ViewOffIcon/> : <ViewIcon/>}
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
                                <FormHelperText textAlign="right">
                                    <Link>Забыли пароль?</Link>
                                </FormHelperText>
                            </FormControl>
                            <Button>Войти</Button>
                        </Stack>
                    </form>
                </Box>
            </Stack>
            <Box>
                Нет аккаунта?{" "}
                <Link color="telegram.500" href="/login/signup">
                    Регистрация
                </Link>
            </Box>
        </Flex>
    );
};

export default SignIn;
