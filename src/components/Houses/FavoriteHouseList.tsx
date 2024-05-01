import {Button, Center, Grid, GridItem, Heading, HStack, Image, Spinner} from "@chakra-ui/react";
import HouseItem from "./HouseItem";
import left from "../../assets/images/icons/left-arrow.png";
import right from "../../assets/images/icons/right-arrow.png";
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {RealEstateInterface} from "../../api/model";
import {favoritesHousesList} from "../../api/Data";

export const FavoriteHouseList = () => {
    const [houses, setHouses] = useState<RealEstateInterface[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [offset, setOffset] = useState(0);
    const limit = 20;
    const navigate = useNavigate()
    const userId = localStorage.getItem("userId")

    const fetchData = async () => {
        setIsLoading(true);
        if (userId !== null) {
            await favoritesHousesList({
                limit: limit,
                offset: offset * limit
            }, parseInt(userId)).then(data => {
                setHouses(data)
            }).catch(e => {
                console.error('Error fetching data:', e);
            })
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (userId !== null) {
            favoritesHousesList({
                limit: limit,
                offset: offset * limit
            }, parseInt(userId)).then(data => {
                setHouses(data)
            }).catch(e => {
                console.error('Error fetching data:', e);
            })
        }
    }, [offset]);

    useEffect(() => {
        fetchData();
    }, []);

    function leftButtonHandler() {
        if (offset > 0) {
            setOffset(offset - 1)
        }
    }

    function rightButtonHandler() {
        setOffset(offset + 1)
    }

    if (isLoading) {
        return (
            <Center>
                <Spinner text-align='center' color={"#2d9d92"}/>
            </Center>
        )
    }

    if (houses.length === 0 || houses[0].photos == null) {
        return (
            <>
                <Center>
                    <Heading size="lg" p={{base: '6', lg: '10'}} text-align="center" color={"#2d9d92"}>
                        Ничего нет...
                    </Heading>
                </Center>

                <HStack width="100%" marginTop={{base: "20px", lg: "35px"}} marginBottom={{base: "75px", lg: "0px"}} justifyContent="center">
                    <Button
                        className="submitButton"
                        backgroundColor="white"
                        textColor={"rgba(0, 0, 0, 1)"}
                        fontWeight="normal"
                        aria-label="Предыдущая страница"
                        minW="44px"
                        width="44px"
                        height="44px"
                        padding={"12px 12px 12px 12px"}
                        marginLeft="10px"
                        marginRight="10px"
                        onClick={e => leftButtonHandler()}
                    >
                        <Image src={left}/>
                    </Button>
                    <Button
                        className="submitButton"
                        backgroundColor="white"
                        textColor={"rgba(0, 0, 0, 1)"}
                        fontWeight="normal"
                        aria-label="Следующая страница"
                        minW="44px"
                        width="44px"
                        height="44px"
                        padding={"12px 12px 12px 12px"}
                        marginLeft="10px"
                        marginRight="10px"
                    >
                        {offset}
                    </Button>
                    <Button
                        className="submitButton"
                        backgroundColor="white"
                        textColor={"rgba(0, 0, 0, 1)"}
                        fontWeight="normal"
                        aria-label="Следующая страница"
                        minW="44px"
                        width="44px"
                        height="44px"
                        padding={"12px 12px 12px 12px"}
                        marginLeft="10px"
                        marginRight="10px"
                        onClick={e => rightButtonHandler()}
                    >
                        <Image src={right}/>
                    </Button>
                </HStack>
            </>
        );
    }

    return (
        <>
            <Grid
                my='3'
                rowGap='4'
                gridTemplateColumns='repeat(auto-fit, minmax(300px, 1fr))'
            >
                {
                    houses.map((item, index) =>
                        <GridItem
                            key={item.id}
                            style={{margin: '10px'}}
                            onClick={_ => {
                                localStorage.setItem("searchedHouseId", item.id.toString())
                                navigate(`/house/${item.id}`)
                            }}
                        >
                            <HouseItem key={item.id} house={item}/>
                        </GridItem>
                    )
                }
            </Grid>

            <HStack width="100%" marginTop={{base: "20px", lg: "35px"}} marginBottom={{base: "75px", lg: "0px"}} justifyContent="center">
                <Button
                    className="submitButton"
                    backgroundColor="white"
                    textColor={"rgba(0, 0, 0, 1)"}
                    fontWeight="normal"
                    aria-label="Предыдущая страница"
                    minW="44px"
                    width="44px"
                    height="44px"
                    padding={"12px 12px 12px 12px"}
                    marginLeft="10px"
                    marginRight="10px"
                    onClick={e => leftButtonHandler()}
                    _hover={{background: "#9cb1b1"}}
                >
                    <Image src={left}/>
                </Button>
                <Button
                    className="submitButton"
                    backgroundColor="white"
                    textColor={"rgba(0, 0, 0, 1)"}
                    fontWeight="normal"
                    aria-label="Следующая страница"
                    minW="44px"
                    width="44px"
                    height="44px"
                    padding={"12px 12px 12px 12px"}
                    marginLeft="10px"
                    marginRight="10px"
                    _hover={{background: "#9cb1b1"}}
                >
                    {offset}
                </Button>
                <Button
                    className="submitButton"
                    backgroundColor="white"
                    textColor={"rgba(0, 0, 0, 1)"}
                    fontWeight="normal"
                    aria-label="Следующая страница"
                    minW="44px"
                    width="44px"
                    height="44px"
                    padding={"12px 12px 12px 12px"}
                    marginLeft="10px"
                    marginRight="10px"
                    onClick={e => rightButtonHandler()}
                    _hover={{background: "#9cb1b1"}}
                >
                    <Image src={right}/>
                </Button>
            </HStack>
        </>
    )
}