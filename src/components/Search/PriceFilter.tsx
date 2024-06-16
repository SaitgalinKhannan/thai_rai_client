import {
    Button, Drawer, DrawerBody,
    DrawerContent, DrawerHeader,
    DrawerOverlay, HStack, Input, InputGroup, useDisclosure,
    Text, useBreakpointValue
} from "@chakra-ui/react";
import React, {useContext, useEffect, useState} from "react";
import {SearchContext} from "../../context/SearchProvider";
import {useTranslation} from "react-i18next";

export default function PriceFilter() {
    const {t} = useTranslation();
    const isDesktop = useBreakpointValue({base: false, lg: true})
    const {priceFrom, setPriceFrom, priceTo, setPriceTo} = useContext(SearchContext)
    const {isOpen, onOpen, onClose} = useDisclosure()
    const [localPriceFrom, setLocalPriceFrom] = useState<number | null>(priceFrom)
    const [localPriceTo, setLocalPriceTo] = useState<number | null>(priceTo)
    const [buttonText, setButtonText] = useState(t('price'))

    useEffect(() => {
        setLocalPriceFrom(priceFrom)
        setLocalPriceTo(priceTo)
    }, [isOpen]);

    const submitHandler = () => {
        setPriceFrom(localPriceFrom)
        setPriceTo(localPriceTo)
        if (localPriceTo == null && localPriceFrom != null) {
            setButtonText(`${t('from')} ${localPriceFrom}`)
        } else if (localPriceTo != null && localPriceFrom == null) {
            setButtonText(`${t('to')} ${localPriceTo}`)
        } else if (localPriceTo == null && localPriceFrom == null) {
            setButtonText(t('price'))
        } else {
            setButtonText(`${t('from')} ${localPriceFrom} ${t('to')} ${localPriceTo}`)
        }
        onClose();
    }

    const onClear = () => {
        setLocalPriceFrom(null)
        setLocalPriceTo(null)
        setPriceFrom(null)
        setPriceTo(null)
        setButtonText(t('price'))
    }

    function localPriceFromInputHandler(e: React.ChangeEvent<HTMLInputElement>) {
        setLocalPriceFrom(parseInt(e.target.value))
    }

    function localPriceToInputHandler(e: React.ChangeEvent<HTMLInputElement>) {
        setLocalPriceTo(parseInt(e.target.value))
    }

    return (
        <>
            <Button
                height="44px"
                width="100%"
                textAlign="left"
                justifyContent="left"
                background="#EDF2F7"
                textColor="black"
                fontSize="1rem"
                fontWeight=""
                onClick={onOpen}
                padding="0px 0px 0px 12px"
                overflow={"hidden"}
                _hover={{background: "#e2e8f0"}}
            >
                {buttonText}
            </Button>
            <Drawer placement={isDesktop ? "right" : "bottom"} onClose={onClose} isOpen={isOpen}>
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
                                onClick={() => onClose()}
                            >
                                {t('close')}
                            </Button>
                            <Text>{t('price')}</Text>
                            <Button
                                alignSelf=""
                                variant='ghost'
                                textColor={"#2d9d92"}
                                onClick={() => onClear()}
                            >
                                {t('reset')}
                            </Button>
                        </HStack>
                    </DrawerHeader>
                    <DrawerBody alignItems="center">
                        <HStack marginBottom="16px">
                            <InputGroup>
                                <Input
                                    type="number"
                                    placeholder={t('from')}
                                    value={localPriceFrom ?? ""}
                                    onChange={e => localPriceFromInputHandler(e)}
                                />
                            </InputGroup>
                            <InputGroup>
                                <Input
                                    type="number"
                                    placeholder={t('to')}
                                    value={localPriceTo ?? ""}
                                    onChange={e => localPriceToInputHandler(e)}
                                />
                            </InputGroup>
                        </HStack>
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
        </>
    )
}