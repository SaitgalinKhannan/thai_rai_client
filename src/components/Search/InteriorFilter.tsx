import React, {useContext, useEffect} from "react";
import {Checkbox, HStack, Stack, Text} from "@chakra-ui/react";
import {SearchContext} from "../../context/SearchProvider";

export default function InteriorFilter() {
    const {interiorItems, setInteriorItems} = useContext(SearchContext)
    const [checkedItems, setCheckedItems] = React.useState([false, false, false, false, false])
    const interiors = ["Любой", "Европейский", "Тайский", "Дизайнерский", "Без мебели/Частично"]

    useEffect(() => {
        setCheckedItems(interiorItems)
    }, [])

    useEffect(() => {
        setInteriorItems(checkedItems)
    }, [checkedItems])

    return (
        <Stack spacing={"12px"} direction="column">
            <Text fontSize={"16px"} textColor={"#2d9d92"}>Интерьер</Text>
            <HStack>
                <Checkbox
                    colorScheme="green"
                    width={"100%"}
                    isChecked={checkedItems[0]}
                    onChange={(e) => setCheckedItems([e.target.checked, checkedItems[1], checkedItems[2], checkedItems[3], checkedItems[4]])}
                >
                    Любой
                </Checkbox>
                <Checkbox
                    colorScheme="green"
                    width={"100%"}
                    isChecked={checkedItems[1]}
                    onChange={(e) => setCheckedItems([checkedItems[0], e.target.checked, checkedItems[2], checkedItems[3], checkedItems[4]])}
                >
                    Тайский
                </Checkbox>
            </HStack>
            <HStack>
                <Checkbox
                    colorScheme="green"
                    width={"100%"}
                    isChecked={checkedItems[2]}
                    onChange={(e) => setCheckedItems([checkedItems[0], checkedItems[1], e.target.checked, checkedItems[3], checkedItems[4]])}
                >
                    Европейский
                </Checkbox>
                <Checkbox
                    colorScheme="green"
                    width={"100%"}
                    isChecked={checkedItems[3]}
                    onChange={(e) => setCheckedItems([checkedItems[0], checkedItems[1], checkedItems[2], e.target.checked, checkedItems[4]])}
                >
                    Дизайнерский
                </Checkbox>
            </HStack>
            <Checkbox
                colorScheme="green"
                width={"100%"}
                isChecked={checkedItems[4]}
                onChange={(e) => setCheckedItems([checkedItems[0], checkedItems[1], checkedItems[2], checkedItems[3], e.target.checked])}
            >
                Без мебели / Частично
            </Checkbox>
        </Stack>
    )
}