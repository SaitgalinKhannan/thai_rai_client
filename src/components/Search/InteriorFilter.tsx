import React, {useContext, useEffect} from "react";
import {Checkbox, HStack, Stack, Text} from "@chakra-ui/react";
import {SearchContext} from "../../context/SearchProvider";
import {useTranslation} from "react-i18next";

export default function InteriorFilter() {
    const {interiorItems, setInteriorItems} = useContext(SearchContext)
    const [checkedItems, setCheckedItems] = React.useState([false, false, false, false, false])
    const interiors = ["Любой", "Европейский", "Тайский", "Дизайнерский", "Без мебели/Частично"]
    const {t} = useTranslation();

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
                    {t('any')}
                </Checkbox>
                <Checkbox
                    colorScheme="green"
                    width={"100%"}
                    isChecked={checkedItems[1]}
                    onChange={(e) => setCheckedItems([checkedItems[0], e.target.checked, checkedItems[2], checkedItems[3], checkedItems[4]])}
                >
                    {t('thai')}
                </Checkbox>
            </HStack>
            <HStack>
                <Checkbox
                    colorScheme="green"
                    width={"100%"}
                    isChecked={checkedItems[2]}
                    onChange={(e) => setCheckedItems([checkedItems[0], checkedItems[1], e.target.checked, checkedItems[3], checkedItems[4]])}
                >
                    {t('euro')}
                </Checkbox>
                <Checkbox
                    colorScheme="green"
                    width={"100%"}
                    isChecked={checkedItems[3]}
                    onChange={(e) => setCheckedItems([checkedItems[0], checkedItems[1], checkedItems[2], e.target.checked, checkedItems[4]])}
                >
                    {t('design')}
                </Checkbox>
            </HStack>
            <Checkbox
                colorScheme="green"
                width={"100%"}
                isChecked={checkedItems[4]}
                onChange={(e) => setCheckedItems([checkedItems[0], checkedItems[1], checkedItems[2], checkedItems[3], e.target.checked])}
            >
                {t('without_furniture')}
            </Checkbox>
        </Stack>
    )
}