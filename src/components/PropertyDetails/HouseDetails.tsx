import {useParams} from "react-router-dom";
import React, {useContext} from "react";
import {Box, Heading, HStack, Stack, Text, VStack} from "@chakra-ui/react";
import {BiArea, BiBed} from "react-icons/bi";
import Form from "./Form";
import {ThaiRaiContext} from "../../context/HouseProvider";
import {RealEstateInterface} from "../../data";
import Carousel from "../Houses/Carousel";


export default function HouseDetails() {
    const {propertyId} = useParams();
    const myPropertyId: string = propertyId ?? "";
    const thaiRaiContext = useContext(ThaiRaiContext);
    const houses: RealEstateInterface[] = thaiRaiContext.realEstates;
    const searchedHouse: RealEstateInterface | undefined = houses.find(value => value.id === parseInt(myPropertyId));

    return (
        <>
            {searchedHouse ? (
                <>
                    <Stack direction={{base: 'column', md: 'row'}} justify='space-between' align={{md: 'center'}}
                           my='28px'>
                        <Box>
                            <Heading fontSize='22px'>{searchedHouse.name}</Heading>
                            <Text fontSize='22px'>
                                {searchedHouse.address.region} {searchedHouse.address.district} {searchedHouse.address.regionInCity} {searchedHouse.address.street} {searchedHouse.address.houseNumber} {searchedHouse.address.index}
                            </Text>
                            <HStack>
                                <Text px='3' borderRadius='full' bg='telegram.300'>{searchedHouse.type}</Text>
                            </HStack>
                        </Box>

                        <Text fontWeight="extrabold" fontSize="20px" color="telegram.500"> {searchedHouse.price}</Text>
                    </Stack>

                    <Stack direction={{base: 'column', md: 'row'}} gap='6' align={{base: 'center', lg: 'flex-start'}}>
                        <VStack align='left' maxW={{base: '100%', md: '70%'}} position="relative" width="100%">
                            <HStack>
                                <Carousel images={searchedHouse.photos ? searchedHouse?.photos : []}/>
                            </HStack>

                            <Stack py='10px' spacing={{sm: '3', md: '5'}} direction={{base: 'column', md: 'row'}}>
                                <HStack>
                                    <BiBed size={"24"} style={{color: "#D53F8C"}}/>
                                    <Text
                                        fontSize="18px">{searchedHouse.roomCount} {searchedHouse.roomCount === 1 ? "Комната" : "Комнат"}</Text>
                                </HStack>

                                <HStack>
                                    <BiArea style={{color: "#D53F8C"}}/>
                                    <Text fontSize="18px">{searchedHouse.area} кв/м</Text>
                                </HStack>
                            </Stack>

                            <Text fontSize='24px'>{searchedHouse.description}</Text>
                        </VStack>

                        <Form searchedHouse={searchedHouse}/>
                    </Stack>
                </>

            ) : (
                <Text fontSize="18px" color="telegram.500">Упс, ошибка: Не удалось найти информацию о доме.</Text>
            )
            }
        </>
    )
}
