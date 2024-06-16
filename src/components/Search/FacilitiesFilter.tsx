import React, {useContext, useEffect} from "react";
import {Checkbox, HStack, Stack, Text} from "@chakra-ui/react";
import {SearchContext} from "../../context/SearchProvider";
import {set} from "zod";
import {useTranslation} from "react-i18next";

export default function FacilitiesFilter() {
    const {facilityItems, setFacilityItems} = useContext(SearchContext)
    const [checkedItems, setCheckedItems] = React.useState([false, false, false, false, false, false, false])
    const facilities = ["Бассейн", "Парковка", "Тренажерный зал", "WI-FI", "Стиральная машина", "Уборка", "Место для курения"]
    const {t} = useTranslation();

    useEffect(() => {
        setCheckedItems(facilityItems)
    }, [])

    useEffect(() => {
        setFacilityItems(checkedItems)
    }, [checkedItems])

    return (
        <Stack spacing={"12px"} direction="column">
            <Text fontSize={"16px"} textColor={"#2d9d92"}>Удобства</Text>
            <HStack>
                <Checkbox
                    colorScheme="green"
                    width={"100%"}
                    isChecked={checkedItems[0]}
                    onChange={(e) => setCheckedItems([e.target.checked, checkedItems[1], checkedItems[2], checkedItems[3], checkedItems[4], checkedItems[5], checkedItems[6]])}
                >
                    {t('swimming_pool')}
                </Checkbox>
                <Checkbox
                    colorScheme="green"
                    width={"100%"}
                    isChecked={checkedItems[1]}
                    onChange={(e) => setCheckedItems([checkedItems[0], e.target.checked, checkedItems[2], checkedItems[3], checkedItems[4], checkedItems[5], checkedItems[6]])}
                >
                    {t('parking')}
                </Checkbox>
            </HStack>
            <HStack>
                <Checkbox
                    colorScheme="green"
                    width={"100%"}
                    isChecked={checkedItems[2]}
                    onChange={(e) => setCheckedItems([checkedItems[0], checkedItems[1], e.target.checked, checkedItems[3], checkedItems[4], checkedItems[5], checkedItems[6]])}
                >
                    {t('gym')}
                </Checkbox>
                <Checkbox
                    colorScheme="green"
                    width={"100%"}
                    isChecked={checkedItems[3]}
                    onChange={(e) => setCheckedItems([checkedItems[0], checkedItems[1], checkedItems[2], e.target.checked, checkedItems[4], checkedItems[5], checkedItems[6]])}
                >
                    {t('wifi')}
                </Checkbox>
            </HStack>

            <HStack>
                <Checkbox
                    colorScheme="green"
                    width={"100%"}
                    isChecked={checkedItems[4]}
                    onChange={(e) => setCheckedItems([checkedItems[0], checkedItems[1], checkedItems[2], checkedItems[3], e.target.checked, checkedItems[5], checkedItems[6]])}
                >
                    {t('washing_machine')}
                </Checkbox>
                <Checkbox
                    colorScheme="green"
                    width={"100%"}
                    isChecked={checkedItems[5]}
                    onChange={(e) => setCheckedItems([checkedItems[0], checkedItems[1], checkedItems[2], checkedItems[3], checkedItems[4], e.target.checked, checkedItems[6]])}
                >
                    {t('cleaning')}
                </Checkbox>
            </HStack>
            <Checkbox
                colorScheme="green"
                width={"100%"}
                isChecked={checkedItems[6]}
                onChange={(e) => setCheckedItems([checkedItems[0], checkedItems[1], checkedItems[2], checkedItems[3], checkedItems[4], checkedItems[5], e.target.checked])}
            >
                {t('smoking_area')}
            </Checkbox>
        </Stack>
    )
}