import {
    Button, Drawer, DrawerBody,
    DrawerContent, DrawerHeader,
    DrawerOverlay, HStack, Input, InputGroup, useDisclosure,
    Text, useBreakpointValue, Checkbox, Stack
} from "@chakra-ui/react";
import React, {useContext, useState} from "react";
import {ThaiRaiContext} from "../../context/HouseProvider";
import {SearchContext} from "../../context/SearchProvider";
import {useTranslation} from "react-i18next";

export default function RoomCountFilter() {
    const isDesktop = useBreakpointValue({base: false, lg: true})
    const {isOpen, onOpen, onClose} = useDisclosure()
    const [checkedItems, setCheckedItems] = React.useState([false, false, false, false, false, false, false])
    const {setRoomItems} = useContext(SearchContext)
    const submitHandler = () => {
        setRoomItems(checkedItems)
        onClose();
    }

    const onClear = () => {
        setCheckedItems([false, false, false, false, false, false, false])
        setRoomItems([false, false, false, false, false, false, false])
    }

    const {t} = useTranslation();

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
                {t('room_count')}
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
                            <Text textAlign={"center"}>{t('room_count')}</Text>
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
                        <HStack marginBottom="16px" justifyContent={"center"}>
                            <Stack spacing={"12px"} direction="column">
                                <Checkbox
                                    colorScheme="green"
                                    isChecked={checkedItems[0]}
                                    onChange={(e) => setCheckedItems([e.target.checked, checkedItems[1], checkedItems[2], checkedItems[3], checkedItems[4], checkedItems[5], checkedItems[6]])}
                                >
                                    {t('room_0')}
                                </Checkbox>
                                <Checkbox
                                    colorScheme="green"
                                    isChecked={checkedItems[1]}
                                    onChange={(e) => setCheckedItems([checkedItems[0], e.target.checked, checkedItems[2], checkedItems[3], checkedItems[4], checkedItems[5], checkedItems[6]])}
                                >
                                    1
                                </Checkbox>
                                <Checkbox
                                    colorScheme="green"
                                    isChecked={checkedItems[2]}
                                    onChange={(e) => setCheckedItems([checkedItems[0], checkedItems[1], e.target.checked, checkedItems[3], checkedItems[4], checkedItems[5], checkedItems[6]])}
                                >
                                    2
                                </Checkbox>
                                <Checkbox
                                    colorScheme="green"
                                    isChecked={checkedItems[3]}
                                    onChange={(e) => setCheckedItems([checkedItems[0], checkedItems[1], checkedItems[2], e.target.checked, checkedItems[4], checkedItems[5], checkedItems[6]])}
                                >
                                    3
                                </Checkbox>
                                <Checkbox
                                    colorScheme="green"
                                    isChecked={checkedItems[4]}
                                    onChange={(e) => setCheckedItems([checkedItems[0], checkedItems[1], checkedItems[2], checkedItems[3], e.target.checked, checkedItems[5], checkedItems[6]])}
                                >
                                    4
                                </Checkbox>
                                <Checkbox
                                    colorScheme="green"
                                    isChecked={checkedItems[5]}
                                    onChange={(e) => setCheckedItems([checkedItems[0], checkedItems[1], checkedItems[2], checkedItems[3], checkedItems[4], e.target.checked, checkedItems[6]])}
                                >
                                    5
                                </Checkbox>
                                <Checkbox
                                    colorScheme="green"
                                    isChecked={checkedItems[6]}
                                    onChange={(e) => setCheckedItems([checkedItems[0], checkedItems[1], checkedItems[2], checkedItems[3], checkedItems[4], checkedItems[5], e.target.checked])}
                                >
                                    6
                                </Checkbox>
                            </Stack>
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