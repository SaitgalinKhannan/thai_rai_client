import React, {useContext, useEffect, useState} from "react";
import {Button, ButtonGroup, Divider, Text, Stack} from "@chakra-ui/react";
import {SearchContext} from "../../context/SearchProvider";
import {useTranslation} from "react-i18next";

export default function RentTimeFilter() {
    const {rentTime, setRentTime} = useContext(SearchContext)
    const [pressedButton, setPressedButton] = useState<string | null>(null)
    const {t} = useTranslation();
    useEffect(() => {
        setPressedButton(rentTime)
    }, []);

    useEffect(() => {
        setRentTime(pressedButton)
    }, [pressedButton])

    return (
        <Stack spacing={"12px"} direction="column">
            <Text fontSize={"16px"} textColor={"#2d9d92"}>{t('rent_time')}</Text>
            <ButtonGroup
                variant="contained"
                aria-label={t('rent_time')}
                spacing={0}
                width="100%"
                alignItems={"center"}
                borderColor="#EDF2F7"
                borderRadius={"6px"}
                borderWidth="2px"
            >
                <Button
                    height="44px"
                    width="35%"
                    borderRadius={"6px 0 0 6px"}
                    textAlign="center"
                    textColor="black"
                    fontSize="1rem"
                    fontWeight=""
                    overflow={"hidden"}
                    backgroundColor={pressedButton === "daily" ? "#2d9d92" : "#ffffff"}
                    onClick={() => setPressedButton("daily")}
                >
                    {t('daily')}
                </Button>
                <Divider orientation='vertical' height="70%"/>
                <Button
                    height="44px"
                    width="65%"
                    borderRadius={"0 6px 6px 0"}
                    textAlign="center"
                    textColor="black"
                    fontSize="1rem"
                    fontWeight=""
                    overflow={"hidden"}
                    backgroundColor={pressedButton === "long" ? "#2d9d92" : "#ffffff"}
                    onClick={() => setPressedButton("long")}
                >
                    {t('long_time')}
                </Button>
            </ButtonGroup>
        </Stack>
    );
};