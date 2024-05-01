import {Box, Button, Heading, HStack, Image, Stack, Text, VStack} from "@chakra-ui/react";
import {bannerData} from "../api/model";
import {BiPlus} from "react-icons/bi";
import Apartment1Lg from "../assets/images/apartments/a1lg.png";
import Apartment6Lg from "../assets/images/apartments/a6lg.png";

export default function Banner() {
    return (
        <Stack direction="row" my='6' overflow='hidden'>
            <VStack
                flexGrow='1'
                px={{sm: "6", lg: "10"}}
                py={{sm: '8', lg: "16"}}
                bg="telegram.100"
                justify="center"
                align="left"
                borderRadius="xl"
            >
                <Heading fontSize={{base: "xl", sm: "2xl", lg: "3xl"}}>
                    Find Real Estate That Suits You.
                </Heading>
                <Text fontSize="sm">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum,
                    fugit illo? Delectus, voluptas unde quae cupiditate at amet beatae
                    totam!
                </Text>
                <Box pt="3" pb="8">
                    <Button>Get Started</Button>
                </Box>

                <HStack spacing="3">
                    {bannerData.map((item, index) => (
                        <VStack
                            key={index}
                            bg="telegram.200"
                            p="4"
                            borderRadius="lg"
                            align="left"
                            pr="3"
                        >
                            <HStack>
                                <Text fontSize={{sm: '14px', lg: 'lg'}} fontWeight="extrabold" mr="-2">
                                    {Object.keys(item)}
                                </Text>{" "}
                                <BiPlus style={{color: "#ED64A6"}}/>
                            </HStack>
                            <Text fontSize={{sm: '12px', lg: 'sm'}}>{Object.values(item)}</Text>
                        </VStack>
                    ))}
                </HStack>
            </VStack>

            <VStack justify='center'>
                <Box h='100%' display={{base: "none", lg: "block", xl: 'none'}}>
                    <Image
                        src={Apartment1Lg}
                        alt="house"
                        h='100%'
                        objectFit='cover'
                    />
                </Box>
                <Box h='50%' display={{base: "none", xl: "block"}}>
                    <Image
                        src={Apartment1Lg}
                        alt="house"
                        style={{height: '100%', width: '100%', objectFit: 'contain'}}
                    />
                </Box>
                <Box h='50%' display={{base: "none", xl: "block"}}>
                    <Image
                        src={Apartment6Lg}
                        alt="house"
                        style={{height: '100%', width: '100%', objectFit: 'contain'}}
                    />
                </Box>
            </VStack>
        </Stack>
    );
}