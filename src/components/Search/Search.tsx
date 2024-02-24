import {ThaiRaiContext} from "../../context/HouseProvider";
import React, {useContext} from "react";
import {Button, Flex, Heading} from "@chakra-ui/react";
import LocationFilter from "./LocationFilter";
import PropertyTypeFilter from "./PropertyTypeFilter";
import PriceFilter from "./PriceFilter";

export default function Search() {
    const {searchHandler, resetFilter} = useContext(ThaiRaiContext);

    return (
        <Flex my='3' direction='column' borderRadius='md' bg='#fff' boxShadow='md' p='5'>

            <Heading py='2' size={{base: 'sm', md: 'md'}}>Поиск по параметрам</Heading>

            <Flex gap={{base: 3, md: 2}} direction={{base: 'column', md: 'row'}} borderRadius='30'>
                <LocationFilter/>
                <PropertyTypeFilter/>
                <PriceFilter/>
                <Button onClick={searchHandler} p={{base: 3, md: 2}} size="100%">Поиск</Button>
                <Button onClick={resetFilter} p={{base: 3, md: 2}} size="100%">Сбросить фильтры</Button>
            </Flex>
        </Flex>
    )
}
