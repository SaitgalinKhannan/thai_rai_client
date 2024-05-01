import {
    Button, Drawer, DrawerBody,
    DrawerContent, DrawerHeader,
    DrawerOverlay, HStack, Input, InputGroup, useDisclosure,
    Text, useBreakpointValue
} from "@chakra-ui/react";
import React, {useContext, useEffect, useState} from "react";
import {SearchContext} from "../../context/SearchProvider";

export default function PriceFilter() {
    const isDesktop = useBreakpointValue({base: false, lg: true})
    const {priceFrom, setPriceFrom, priceTo, setPriceTo} = useContext(SearchContext)
    const {isOpen, onOpen, onClose} = useDisclosure()
    const [localPriceFrom, setLocalPriceFrom] = useState<number | null>(priceFrom)
    const [localPriceTo, setLocalPriceTo] = useState<number | null>(priceTo)
    const [buttonText, setButtonText] = useState("Цена")

    useEffect(() => {
        setLocalPriceFrom(priceFrom)
        setLocalPriceTo(priceTo)
    }, [isOpen]);

    const submitHandler = () => {
        setPriceFrom(localPriceFrom)
        setPriceTo(localPriceTo)
        if (localPriceTo == null && localPriceFrom != null) {
            setButtonText(`от ${localPriceFrom}`)
        } else if (localPriceTo != null && localPriceFrom == null) {
            setButtonText(`до ${localPriceTo}`)
        } else if (localPriceTo == null && localPriceFrom == null) {
            setButtonText("Цена")
        } else {
            setButtonText(`от ${localPriceFrom} до ${localPriceTo}`)
        }
        onClose();
    }

    const onClear = () => {
        setLocalPriceFrom(null)
        setLocalPriceTo(null)
        setPriceFrom(null)
        setPriceTo(null)
        setButtonText("Цена")
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
                            <Button alignSelf="" variant='ghost' textColor={"#2d9d92"}
                                    onClick={() => onClose()}>Закрыть</Button>
                            <Text>Цена</Text>
                            <Button alignSelf="" variant='ghost' textColor={"#2d9d92"}
                                    onClick={() => onClear()}>Сбросить</Button>
                        </HStack>
                    </DrawerHeader>
                    <DrawerBody alignItems="center">
                        <HStack marginBottom="16px">
                            <InputGroup>
                                <Input
                                    type="number"
                                    placeholder="от"
                                    value={localPriceFrom ?? ""}
                                    onChange={e => localPriceFromInputHandler(e)}
                                />
                            </InputGroup>
                            <InputGroup>
                                <Input
                                    type="number"
                                    placeholder="до"
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
                            Применить
                        </Button>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}