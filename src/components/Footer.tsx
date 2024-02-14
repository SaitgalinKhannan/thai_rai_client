import {Center, Text} from "@chakra-ui/react";

export default function Footer() {
    return (
        <>
            <Center borderTopEndRadius='50%' mt='8' py='20px' bg='telegram.700' color='white'>
                <Text fontSize='15px'>Copyright &copy; 2023. All rights reserved.</Text>
            </Center>
        </>
    )
}