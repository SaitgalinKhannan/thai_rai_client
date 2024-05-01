import {Box, Image, Stack, Text, VStack} from "@chakra-ui/react";
import React, {useEffect} from "react";
import {UserWithoutPassword} from "../../api/model";
import photo from "../../assets/images/agents/profile.png"
import {userPhoto} from "../../api/Data";

interface FormProps {
    owner: UserWithoutPassword | null
}

export default function Form({owner}: Readonly<FormProps>) {
    return (
        <>
            {
                owner ? (
                    <VStack
                        border="1px"
                        borderColor={"#2d9d92"}
                        borderRadius="10"
                        boxShadow='md'
                        px="5"
                        py="6"
                        flexGrow={1}
                        width="100%"
                        marginBottom="10px"
                    >
                        <Stack direction={{base: 'column', lg: 'row'}} justifyContent={'center'}
                               alignItems={'center'}>
                            <Image
                                borderRadius='full'
                                boxSize='100px'
                                src={owner.id && owner.photoUrl ? userPhoto(owner.id) : photo}
                            />
                            <Box>
                                <Text mb='-3px' fontWeight='extrabold' fontSize='18px'>{owner.firstName}</Text>
                                <Text style={{fontSize: '18px'}}> {owner.lastName}</Text>
                            </Box>
                        </Stack>

                        <VStack my='3px' spacing='2px'>
                            <form className={"owner"}>
                                <Text style={{fontSize: '18px'}} mt='3' mb='2'>Email: {owner.email}</Text>
                                <Text style={{fontSize: '18px'}} mt='3' mb='2'>Телефон: {owner.phone}</Text>
                            </form>
                        </VStack>
                    </VStack>
                ) : (
                    <Box
                        border="1px"
                        borderColor={"#2d9d92"}
                        boxShadow='md'
                        px="5"
                        py="6"
                        flexGrow={1}
                        width={{base: '100%', lg: '30%'}}
                    >
                        <Text mb='-3px' fontWeight='bold' fontSize='18px'>Загрузка...</Text>
                    </Box>
                )
            }
        </>

    )
}