import React, {useContext, useEffect, useState} from "react";
import {Button, ButtonGroup, Divider} from "@chakra-ui/react";
import {SearchContext} from "../../context/SearchProvider";
import {set} from "zod";

export default function NewBuildingFilter() {
    const [pressedButton, setPressedButton] = useState("all")

    const {setNewBuilding} = useContext(SearchContext)

    useEffect(() => {
        if (pressedButton === "all") {
            setNewBuilding(null)
        } else if (pressedButton === "old") {
            setNewBuilding(false)
        } else {
            setNewBuilding(true)
        }
    }, [pressedButton]);

    return (
        <ButtonGroup
            variant="contained"
            aria-label="Тип недвижимости"
            spacing={0}
            width={{base: "100%", lg: "50%"}}
            alignItems={"center"}
            borderColor="#EDF2F7"
            borderRadius={"6px"}
            borderWidth="2px"
        >
            <Button
                height="44px"
                width="15%"
                borderRadius={"6px 0 0 6px"}
                textAlign="center"
                textColor="black"
                fontSize="1rem"
                fontWeight=""
                overflow={"hidden"}
                backgroundColor={pressedButton === "all" ? "#2d9d92" : "#ffffff"}
                onClick={() => setPressedButton("all")}
            >
                Все
            </Button>
            <Divider orientation='vertical' height="70%"/>
            <Button
                height="44px"
                width="35%"
                borderRadius={0}
                textAlign="center"
                textColor="black"
                fontSize="1rem"
                fontWeight=""
                overflow={"hidden"}
                backgroundColor={pressedButton === "old" ? "#2d9d92" : "#ffffff"}
                onClick={() => setPressedButton("old")}
            >
                Вторичка
            </Button>
            <Divider orientation='vertical' height="70%"/>
            <Button
                height="44px"
                width="50%"
                borderRadius={"0 6px 6px 0"}
                textAlign="center"
                textColor="black"
                fontSize="1rem"
                fontWeight=""
                overflow={"hidden"}
                backgroundColor={pressedButton === "new" ? "#2d9d92" : "#ffffff"}
                onClick={() => setPressedButton("new")}
            >
                Новостройка
            </Button>
        </ButtonGroup>
    );
};