import {Button, ButtonGroup, Flex, Image, useBreakpointValue, VStack} from "@chakra-ui/react";
import React, {useContext, useEffect} from "react";
import {ThaiRaiContext} from "../../context/HouseProvider";
import {useNavigate} from "react-router-dom";
import logo from "../../assets/images/logo/logohorizontal.png";
import StatusFilter from "./StatusFilter";
import BuildingTypeFilter from "./BuildingTypeFilter";
import RegionFilter from "./RegionFilter";
import AreaFilter from "./AreaFilter";
import PriceFilter from "./PriceFilter";
import filter from "../../assets/images/icons/filter.png";
import {SearchContext} from "../../context/SearchProvider";
import {StatusForUsers, statusForUsersMapping} from "../../api/model";
import RoomCountFilter from "./RoomCountFilter";
import NewBuildingFilter from "./NewBuildingFilter";
import AdditionalFilters from "./AdditionalFilters";
import {useTranslation} from "react-i18next";

export default function Search() {
    const isDesktop = useBreakpointValue({base: false, lg: true})
    const isMobile = useBreakpointValue({base: true, lg: false})
    const {isLoading} = useContext(ThaiRaiContext)
    return (
        <>
            {!isLoading && ((isDesktop && <DesktopSearch/>) || (isMobile && <MobileSearch/>))}
        </>
    )
}

function MobileSearch() {
    useBreakpointValue({base: false, lg: true});
    const {resetFilter} = useContext(ThaiRaiContext);
    const navigate = useNavigate();
    const searchContext = useContext(SearchContext)
    const {t} = useTranslation();

    useEffect(() => {
        searchContext.setAreaFrom(null)
        searchContext.setAreaTo(null)
        searchContext.setNewBuilding(null)
    }, [searchContext.status])

    const toMainPage = () => {
        resetFilter()
        navigate("/")
    }

    function rentButton() {
        searchContext.setStatus(statusForUsersMapping[StatusForUsers.RENT])
    }

    function saleButton() {
        searchContext.setStatus(statusForUsersMapping[StatusForUsers.SALE])
    }

    return (
        <VStack spacing={0} padding={"16px"}>
            <Image marginTop="3" padding={"1px 1px 1px 1px"} src={logo} height="44px" onClick={toMainPage}/>

            <Flex marginTop="3" gap={{base: 3, lg: 2}} padding={0} width="100%" direction="row" borderRadius="30">
                <Button
                    height="80px"
                    width="fit-content"
                    textAlign="left"
                    background={"#f2f1f0"}
                    borderRadius="12px"
                    textColor="black"
                    fontSize="1rem"
                    fontWeight=""
                    whiteSpace={"normal"}
                    onClick={() => rentButton()}
                    overflow={"hidden"}
                    _hover={{background: "#e2e8f0"}}
                >
                    {t('rental_property')}
                </Button>
                <Button
                    height="80px"
                    width="fit-content"
                    textAlign="left"
                    background={"#f2f1f0"}
                    borderRadius="12px"
                    textColor="black"
                    fontSize="1rem"
                    fontWeight=""
                    whiteSpace={"normal"}
                    onClick={saleButton}
                    overflow={"hidden"}
                    _hover={{background: "#e2e8f0"}}
                >
                    {t('buying_a_property')}
                </Button>
            </Flex>

            {/*<Flex marginTop="3" gap={{base: 3, lg: 2}} padding={0} width="100%" direction="row" borderRadius="30">
                <Button
                    height="80px"
                    textAlign="left"
                    background={"#f2f1f0"}
                    borderRadius="12px"
                    textColor="black"
                    fontSize="1rem"
                    fontWeight=""
                    whiteSpace={"normal"}
                    overflow={"hidden"}
                    _hover={{background: "#e2e8f0"}}
                >
                    Экскурсии
                </Button>
                <Button
                    height="80px"
                    textAlign="left"
                    background={"#f2f1f0"}
                    borderRadius="12px"
                    textColor="black"
                    fontSize="1rem"
                    fontWeight=""
                    whiteSpace={"normal"}
                    overflow={"hidden"}
                    _hover={{background: "#e2e8f0"}}
                >
                    <Link href={"https://t.me/Easy_One_bot"} isExternal>Обмен валют</Link>
                </Button>
            </Flex>*/}

            <Flex marginTop="3" gap={{base: 3, lg: 2}} padding={0} width="100%" direction="row" borderRadius="30">
                <StatusFilter/>
                <BuildingTypeFilter/>
            </Flex>
            <Flex marginTop="3" gap={{base: 3, lg: 2}} width="100%" direction="row" borderRadius="30">
                <RegionFilter/>
                <RoomCountFilter/>
            </Flex>
            {
                searchContext.status !== "RENT" &&
                <Flex marginTop="3" gap={{base: 3, lg: 2}} width="100%" direction="row" borderRadius="30">
                    <NewBuildingFilter/>
                </Flex>
            }
            <Flex marginTop="3" gap={{base: 3, lg: 2}} width="100%" direction="row" borderRadius="30">
                {searchContext.status !== "RENT" && <AreaFilter/>}
                <PriceFilter/>
                <Button
                    className="submitButton"
                    onClick={searchContext.onOpen}
                    backgroundColor="white"
                    textColor={"rgba(0, 0, 0, 1)"}
                    fontWeight="normal"
                    aria-label={t('filters')}
                    minW="44px"
                    width="44px"
                    height="44px"
                    padding={"12px 12px 12px 12px"}
                    _hover={{background: "#e2e8f0"}}
                >
                    <Image src={filter}/>
                </Button>

                <AdditionalFilters/>
            </Flex>
            <Flex my="3" gap={{base: 3, lg: 2}} width="100%" direction="row" borderRadius="30">
                <Button
                    className="submitButton"
                    onClick={searchContext.searchHandler}
                    backgroundColor="white"
                    textColor={"rgba(0, 0, 0, 1)"}
                    fontWeight="normal"
                    height="44px" size="100%"
                    padding={"0px 16px 0px 16px"}
                    _hover={{background: "#e2e8f0"}}
                >
                    {t('search')}
                </Button>
                <Button
                    className="submitButton"
                    onClick={resetFilter}
                    backgroundColor="white"
                    textColor={"rgba(0, 0, 0, 1)"}
                    fontWeight="normal"
                    height="44px" size="100%"
                    padding={"0px 16px 0px 16px"}
                    _hover={{background: "#e2e8f0"}}
                >
                    {t('reset_filters')}
                </Button>
            </Flex>
        </VStack>
    )
}

function DesktopSearch() {
    const searchContext = useContext(SearchContext);
    const {t} = useTranslation();
    useBreakpointValue({base: false, lg: true});

    function rentButton() {
        searchContext.setStatus(statusForUsersMapping[StatusForUsers.RENT])
    }

    function saleButton() {
        searchContext.setStatus(statusForUsersMapping[StatusForUsers.SALE])
    }

    return (
        <VStack spacing={0}>
            <Flex marginTop="3" gap={{base: 3, lg: 2}} padding={0} width="100%" direction="row" borderRadius="30">
                <Button
                    height="80px"
                    width="fit-content"
                    textAlign="left"
                    background={"#f2f1f0"}
                    borderRadius="12px"
                    textColor="black"
                    fontSize="1rem"
                    fontWeight=""
                    whiteSpace={"normal"}
                    onClick={rentButton}
                    overflow={"hidden"}
                    _hover={{background: "#e2e8f0"}}
                >
                    {t('rental_property')}
                </Button>
                <Button
                    height="80px"
                    width="fit-content"
                    textAlign="left"
                    background={"#f2f1f0"}
                    borderRadius="12px"
                    textColor="black"
                    fontSize="1rem"
                    fontWeight=""
                    whiteSpace={"normal"}
                    onClick={saleButton}
                    overflow={"hidden"}
                    _hover={{background: "#e2e8f0"}}
                >
                    {t('buying_a_property')}
                </Button>

                {/*<Button
                    height="80px"
                    textAlign="left"
                    background={"#f2f1f0"}
                    borderRadius="12px"
                    textColor="black"
                    fontSize="1rem"
                    fontWeight=""
                    whiteSpace={"normal"}
                    overflow={"hidden"}
                    _hover={{background: "#e2e8f0"}}
                >
                    Экскурсии
                </Button>
                <Button
                    height="80px"
                    textAlign="left"
                    background={"#f2f1f0"}
                    borderRadius="12px"
                    textColor="black"
                    fontSize="1rem"
                    fontWeight=""
                    whiteSpace={"normal"}
                    overflow={"hidden"}
                    _hover={{background: "#e2e8f0"}}
                >
                    <Link href={"https://t.me/Easy_One_bot"} isExternal>Обмен валют</Link>
                </Button>*/}
            </Flex>

            <Flex marginTop="3" gap={{base: 3, lg: 2}} width="100%" direction="row" borderRadius="30">
                <StatusFilter/>
                <BuildingTypeFilter/>
                <RegionFilter/>
                <RoomCountFilter/>
                {searchContext.status !== "RENT" && <AreaFilter/>}
                <PriceFilter/>
                <Button
                    className="submitButton"
                    onClick={searchContext.onOpen}
                    backgroundColor="white"
                    textColor={"rgba(0, 0, 0, 1)"}
                    fontWeight="normal"
                    aria-label="Фильры"
                    minW="44px"
                    width="44px"
                    height="44px"
                    padding={"12px 12px 12px 12px"}
                    _hover={{background: "#e2e8f0"}}
                >
                    <Image src={filter}/>
                </Button>

                <AdditionalFilters/>
            </Flex>

            <Flex marginTop="3" gap={{base: 3, lg: 2}} width="100%" direction="row" borderRadius="30"
                  justifyContent={searchContext.status !== "RENT" ? "space-between" : "right"}>
                {searchContext.status !== "RENT" && <NewBuildingFilter/>}
                <ButtonGroup>
                    <Button
                        className="submitButton"
                        onClick={searchContext.searchHandler}
                        backgroundColor="white"
                        textColor={"rgba(0, 0, 0, 1)"}
                        fontWeight="normal"
                        height="44px" size="100%"
                        padding={"0px 16px 0px 16px"}
                        _hover={{background: "#e2e8f0"}}
                    >
                        {t('search')}
                    </Button>
                    <Button
                        className="submitButton"
                        onClick={searchContext.resetFilters}
                        backgroundColor="white"
                        textColor={"rgba(0, 0, 0, 1)"}
                        fontWeight="normal"
                        height="44px" size="100%"
                        padding={"0px 16px 0px 16px"}
                        _hover={{background: "#e2e8f0"}}
                    >
                        {t('reset_filters')}
                    </Button>
                </ButtonGroup>
            </Flex>
        </VStack>
    );
}