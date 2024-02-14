import {Box, Image, Stack, Text, VStack} from "@chakra-ui/react";
import React from "react";
import {RealEstateInterface} from "../../data";
import photo from "../../assets/images/agents/agent1.png"

interface FormProps {
    searchedHouse: RealEstateInterface | undefined;
}

export default function Form({searchedHouse}: Readonly<FormProps>) {
    return (
        <VStack
            border='1px'
            borderColor='telegram.100'
            boxShadow='md'
            px='5'
            py='6'
            flexGrow={1}
            width={{base: '100%', md: '30%'}}
        >
            <Stack direction={{base: 'column', lg: 'row'}} justifyContent={'center'} alignItems={'center'}>
                <Image
                    borderRadius='full'
                    boxSize='100px'
                    src={photo}
                />
                <Box>
                    <Text mb='-3px' fontWeight='extrabold' fontSize='18px'>{searchedHouse?.owner.firstName}</Text>
                    <Text style={{fontSize: '18px'}}> {searchedHouse?.owner.lastName}</Text>
                </Box>
            </Stack>

            <VStack my='3px' spacing='2px'>
                <form className={"owner"}>
                    <Text style={{fontSize: '18px'}} mt='3' mb='2'>Email: {searchedHouse?.owner.email}</Text>
                    <Text style={{fontSize: '18px'}} mt='3' mb='2'>Телефон: {searchedHouse?.owner.phone}</Text>
                </form>
            </VStack>
        </VStack>
    )
}