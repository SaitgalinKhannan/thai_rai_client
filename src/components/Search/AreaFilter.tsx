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
import {useTranslation} from "react-i18next";

export default function AreaFilter() {
    const {t} = useTranslation();
    const isDesktop = useBreakpointValue({base: false, lg: true})
    const {areaFrom, setAreaFrom, areaTo, setAreaTo} = useContext(SearchContext)
    const {isOpen, onOpen, onClose} = useDisclosure()
    const [localAreaFrom, setLocalAreaFrom] = useState<number | null>(areaFrom)
    const [localAreaTo, setLocalAreaTo] = useState<number | null>(areaTo)
    const [buttonText, setButtonText] = useState(t('area'))

    useEffect(() => {
        setLocalAreaFrom(areaFrom)
        setLocalAreaTo(areaTo)
    }, [isOpen]);

    const submitHandler = () => {
        setAreaFrom(localAreaFrom)
        setAreaTo(localAreaTo)
        if (localAreaTo == null && localAreaFrom != null) {
            setButtonText(`${t('from')} ${localAreaFrom} м²`)
        } else if (localAreaTo != null && localAreaFrom == null) {
            setButtonText(`${t('to')} ${localAreaTo} м²`)
        } else if (localAreaTo == null && localAreaFrom == null) {
            setButtonText(t('area'))
        } else {
            setButtonText(`${t('from')} ${localAreaFrom} ${t('to')} ${localAreaTo} м²`)
        }
        onClose();
    }

    const onClear = () => {
        setLocalAreaFrom(null)
        setLocalAreaTo(null)
        setAreaTo(null)
        setAreaFrom(null)
        setButtonText(t('area'))
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
                            <Button
                                alignSelf=""
                                variant='ghost'
                                textColor={"#2d9d92"}
                                onClick={() => onClose()}
                            >
                                {t('close')}
                            </Button>
                            <Text>{t('area')}</Text>
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
                                    value={localAreaFrom ?? ""}
                                    onChange={e => localAreaFromInputHandler(e)}
                                />
                            </InputGroup>
                            <InputGroup>
                                <Input
                                    type="number"
                                    placeholder={t('to')}
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
                            {t('apply')}
                        </Button>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
};

