import {Divider, Flex, Heading, HStack, Image, Stack, Text, VStack} from "@chakra-ui/react";
import {BiArea, BiBed} from "react-icons/bi";
import {RealEstateInterface} from "../../api/model";
import {image} from "../../api/Data";
import noImage from "../../assets/images/no-photo.png"

export default function HouseItem({house}: Readonly<{ house: RealEstateInterface }>) {
    return (
        <Flex justify='center' align='center'>
            <Stack justify='center' width="350px" bg="white" boxShadow="xl" borderRadius="xl">
                <Image src={house.photos.length > 0 ? image(house.photos[0].id) : noImage} h='170' alt='houses'
                       borderTopRadius="xl" objectFit="cover"/>

                <VStack p='4' align='left'>
                    <Text mt="-1" fontWeight="extrabold" fontSize="18px" color={"#2d9d92"}>
                        {house.price}{" "}
                        <span style={{fontSize: 14, color: "grey", fontWeight: "normal"}}>
                            / THB
                        </span>
                    </Text>

                    <Heading fontSize="24px" letterSpacing="tight" overflow={"hidden"}>
                        {house.name}
                    </Heading>

                    <Text fontSize="16px" color="grey">
                        {house.addressDto.regionInCity}
                    </Text>

                    <Divider my="1"/>

                    <HStack spacing="5">
                        <HStack>
                            <BiBed style={{color: "#2d9d92"}}/>
                            <Text
                                fontSize="12px">{house.roomCount} {house.roomCount === 1 ? "Комната" : "Комнат"}</Text>
                        </HStack>

                        <HStack>
                            <BiArea style={{color: "#2d9d92"}}/>
                            <Text fontSize="12px">{house.area} кв/м</Text>
                        </HStack>
                    </HStack>

                </VStack>
            </Stack>
        </Flex>
    )
}