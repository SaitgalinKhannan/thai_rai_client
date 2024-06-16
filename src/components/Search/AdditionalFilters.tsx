import React, {useContext} from "react";
import {SearchContext} from "../../context/SearchProvider";
import {
    Button,
    Drawer, DrawerBody,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    HStack,
    Text,
    useBreakpointValue, VStack
} from "@chakra-ui/react";
import InteriorFilter from "./InteriorFilter";
import FacilitiesFilter from "./FacilitiesFilter";
import RentTimeFilter from "./RentTimeFilter";
import RulesFilter from "./RulesFilter";
import {useTranslation} from "react-i18next";

export default function AdditionalFilters() {
    const isDesktop = useBreakpointValue({base: false, lg: true})
    const searchContext = useContext(SearchContext)
    const {t} = useTranslation();
    const submitHandler = () => {
        searchContext.onClose();
    }

    const resetFilters = () => {
        searchContext.setInteriorItems([false, false, false, false, false, false, false])
        searchContext.setFacilityItems([false, false, false, false, false, false, false])
        searchContext.setRentTime(null)
        searchContext.setRuleItems([false, false])
        searchContext.onClose();
    }

    return (
        <Drawer placement={isDesktop ? "right" : "bottom"} onClose={searchContext.onClose}
                isOpen={searchContext.isOpen}>
            <DrawerOverlay/>
            <DrawerContent borderRadius={{base: "16px 16px 0px 0px", lg: "16px 0px 0px 16px"}}>
                <DrawerHeader
                    borderBottomWidth='1px'
                >
                    <HStack
                        justifyContent={"space-between"}
                        width={"100%"}
                    >
                        <Button
                            alignSelf=""
                            variant='ghost'
                            textColor={"#2d9d92"}
                            onClick={() => searchContext.onClose()}
                        >
                            {t('close')}
                        </Button>
                        <Text>{t('filters')}</Text>
                        <Button
                            alignSelf=""
                            variant='ghost'
                            textColor={"#2d9d92"}
                            onClick={() => resetFilters()}
                        >
                            {t('reset')}
                        </Button>
                    </HStack>
                </DrawerHeader>
                <DrawerBody alignItems="center">
                    <VStack marginBottom="16px" alignItems={"left"} spacing={10}>
                        <InteriorFilter/>
                        <FacilitiesFilter/>
                        {searchContext.status === "RENT" && <RentTimeFilter/>}
                        {searchContext.status === "RENT" && <RulesFilter/>}
                    </VStack>
                    <Button
                        className="submitButton"
                        backgroundColor="white"
                        textColor={"rgba(0, 0, 0, 1)"}
                        fontWeight="normal"
                        onClick={() => submitHandler()}
                        width="100%"
                        _hover={{background: "#e2e8f0"}}
                    >
                        {t('apply')}
                    </Button>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    )
}