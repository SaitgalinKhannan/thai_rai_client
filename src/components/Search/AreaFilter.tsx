import React, {useContext, useEffect, useState} from "react";
import {ThaiRaiContext} from "../../context/HouseProvider";
import {
    Button,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    HStack, Input, InputGroup, Text, useBreakpointValue,
    useDisclosure
} from "@chakra-ui/react";
import {SearchContext} from "../../context/SearchProvider";

export default function AreaFilter() {
    const isDesktop = useBreakpointValue({base: false, lg: true})
    const {areaFrom, setAreaFrom, areaTo, setAreaTo} = useContext(SearchContext)
    const {isOpen, onOpen, onClose} = useDisclosure()
    const [localAreaFrom, setLocalAreaFrom] = useState<number | null>(areaFrom)
    const [localAreaTo, setLocalAreaTo] = useState<number | null>(areaTo)
    const [buttonText, setButtonText] = useState("Площадь")

    useEffect(() => {
        setLocalAreaFrom(areaFrom)
        setLocalAreaTo(areaTo)
    }, [isOpen]);

    const submitHandler = () => {
        setAreaFrom(localAreaFrom)
        setAreaTo(localAreaTo)
        if (localAreaTo == null && localAreaFrom != null) {
            setButtonText(`от ${localAreaFrom} м²`)
        } else if (localAreaTo != null && localAreaFrom == null) {
            setButtonText(`до ${localAreaTo} м²`)
        } else if (localAreaTo == null && localAreaFrom == null) {
            setButtonText("Площадь")
        } else {
            setButtonText(`от ${localAreaFrom} до ${localAreaTo} м²`)
        }
        onClose();
    }

    const onClear = () => {
        setLocalAreaFrom(null)
        setLocalAreaTo(null)
        setAreaTo(null)
        setAreaFrom(null)
        setButtonText("Площадь")
    }

    function localAreaFromInputHandler(e: React.ChangeEvent<HTMLInputElement>) {
        setLocalAreaFrom(parseInt(e.target.value))
    }

    function localAreaToInputHandler(e: React.ChangeEvent<HTMLInputElement>) {
        setLocalAreaTo(parseInt(e.target.value))
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
                        textAlign="center"
                    >
                        <HStack
                            justifyContent={"space-between"}
                            width={"100%"}
                        >
                            <Button alignSelf="" variant='ghost' textColor={"#2d9d92"} onClick={() => onClose()}>Закрыть</Button>
                            <Text>Площадь</Text>
                            <Button alignSelf="" variant='ghost' textColor={"#2d9d92"} onClick={() => onClear()}>Сбросить</Button>
                        </HStack>
                    </DrawerHeader>
                    <DrawerBody alignItems="center">
                        <HStack marginBottom="16px">
                            <InputGroup>
                                <Input
                                    type="number"
                                    placeholder="от"
                                    value={localAreaFrom ?? ""}
                                    onChange={e => localAreaFromInputHandler(e)}
                                />
                            </InputGroup>
                            <InputGroup>
                                <Input
                                    type="number"
                                    placeholder="до"
                                    value={localAreaTo ?? ""}
                                    onChange={e => localAreaToInputHandler(e)}
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
    );
};

