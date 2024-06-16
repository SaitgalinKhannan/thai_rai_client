import {ThaiRaiContext} from "../../context/HouseProvider";
import React, {useContext} from "react";
import {Button, Center, Grid, GridItem, Heading, HStack, Image, Spinner} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";
import HouseItem from "./HouseItem";
import left from "../../assets/images/icons/left-arrow.png";
import right from "../../assets/images/icons/right-arrow.png"
import {useTranslation} from "react-i18next";

export default function HouseList() {
    const realEstateContext = useContext(ThaiRaiContext);
    const {offset, setOffset} = useContext(ThaiRaiContext);
    const navigate = useNavigate()
    const {t} = useTranslation();

    function leftButtonHandler() {
        if (offset > 0) {
            setOffset(offset - 1)
        }
    }

    function rightButtonHandler() {
        setOffset(offset + 1)
    }

    if (realEstateContext.isLoading) {
        return (
            <Center>
                <Spinner text-align='center' color={"#2d9d92"}/>
            </Center>
        )
    }

    if (realEstateContext.realEstates.length === 0 || realEstateContext.realEstates[0].photos == null) {
        return (
            <>
                <Center>
                    <Heading size="lg" p={{base: '6', lg: '10'}} text-align="center" color={"#2d9d92"}>
                        {t('nothing')}
                    </Heading>
                </Center>

                <HStack width="100%" marginTop={{base: "20px", lg: "35px"}} marginBottom={{base: "75px", lg: "0px"}} justifyContent="center">
                    <Button
                        className="submitButton"
                        backgroundColor="white"
                        textColor={"rgba(0, 0, 0, 1)"}
                        fontWeight="normal"
                        aria-label={t('prev_page')}
                        minW="44px"
                        width="44px"
                        height="44px"
                        padding={"12px 12px 12px 12px"}
                        marginLeft="10px"
                        marginRight="10px"
                        onClick={() => leftButtonHandler()}
                        _hover={{background: "#9cb1b1"}}
                    >
                        <Image src={left}/>
                    </Button>
                    <Button
                        className="submitButton"
                        backgroundColor="white"
                        textColor={"rgba(0, 0, 0, 1)"}
                        fontWeight="normal"
                        aria-label={t('page')}
                        minW="44px"
                        width="44px"
                        height="44px"
                        padding={"12px 12px 12px 12px"}
                        marginLeft="10px"
                        marginRight="10px"
                        _hover={{background: "#9cb1b1"}}
                    >
                        {realEstateContext.offset}
                    </Button>
                    <Button
                        className="submitButton"
                        backgroundColor="white"
                        textColor={"rgba(0, 0, 0, 1)"}
                        fontWeight="normal"
                        aria-label={t('next_page')}
                        minW="44px"
                        width="44px"
                        height="44px"
                        padding={"12px 12px 12px 12px"}
                        marginLeft="10px"
                        marginRight="10px"
                        onClick={() => rightButtonHandler()}
                        _hover={{background: "#9cb1b1"}}
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
                    realEstateContext.realEstates.map((item, index) =>
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
                    aria-label={t('prev_page')}
                    minW="44px"
                    width="44px"
                    height="44px"
                    padding={"12px 12px 12px 12px"}
                    marginLeft="10px"
                    marginRight="10px"
                    onClick={() => leftButtonHandler()}
                    _hover={{background: "#9cb1b1"}}
                >
                    <Image src={left}/>
                </Button>
                <Button
                    className="submitButton"
                    backgroundColor="white"
                    textColor={"rgba(0, 0, 0, 1)"}
                    fontWeight="normal"
                    aria-label={t('page')}
                    minW="44px"
                    width="44px"
                    height="44px"
                    padding={"12px 12px 12px 12px"}
                    marginLeft="10px"
                    marginRight="10px"
                    _hover={{background: "#9cb1b1"}}
                >
                    {realEstateContext.offset}
                </Button>
                <Button
                    className="submitButton"
                    backgroundColor="white"
                    textColor={"rgba(0, 0, 0, 1)"}
                    fontWeight="normal"
                    aria-label={t('next_page')}
                    minW="44px"
                    width="44px"
                    height="44px"
                    padding={"12px 12px 12px 12px"}
                    marginLeft="10px"
                    marginRight="10px"
                    onClick={() => rightButtonHandler()}
                    _hover={{background: "#9cb1b1"}}
                >
                    <Image src={right}/>
                </Button>
            </HStack>
        </>
    )
}