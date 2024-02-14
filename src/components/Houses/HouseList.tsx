import {ThaiRaiContext} from "../../context/HouseProvider";
import {useContext} from "react";
import {Center, Grid, Heading, Spinner} from "@chakra-ui/react";
import {Link} from "react-router-dom";
import HouseItem from "./HouseItem";

export default function HouseList() {
    const realEstateContext = useContext(ThaiRaiContext);

    if (realEstateContext.isLoading) {
        return (
            <Center>
                <Spinner text-align='center' color='telegram.500'/>
            </Center>
        )
    }

    if (realEstateContext.realEstates.length === 0 || realEstateContext.realEstates[0].photos == null) {
        return (
            <Center>
                <Heading size="lg" p={{base: '6', md: '10'}} text-align="center" color='telegram.500'>
                    Ничего нет...
                </Heading>
            </Center>
        );
    }

    return (
        <Grid my='3' rowGap='4' gridTemplateColumns='repeat(auto-fit, minmax(300px, 1fr))'>
            {
                realEstateContext.realEstates.map(item =>
                    <Link to={`/property-details/${item.id}`} key={item.id} style={{margin: '10px'}}>
                        <HouseItem key={item.id} house={item}/>
                    </Link>
                )
            }
        </Grid>
    )
}