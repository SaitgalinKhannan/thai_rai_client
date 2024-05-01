import React, {useContext, useEffect} from "react";
import {Checkbox, HStack, Stack, Text} from "@chakra-ui/react";
import {SearchContext} from "../../context/SearchProvider";

export default function RulesFilter() {
    const {ruleItems, setRuleItems} = useContext(SearchContext)
    const [checkedItems, setCheckedItems] = React.useState([false, false])

    useEffect(() => {
        setCheckedItems(ruleItems)
    }, [])

    useEffect(() => {
        setRuleItems(checkedItems)
    }, [checkedItems])

    return (
        <Stack spacing={"12px"} direction="column">
            <Text fontSize={"16px"} textColor={"#2d9d92"}>Правила</Text>
            <HStack>
                <Checkbox
                    colorScheme="green"
                    width={"100%"}
                    isChecked={checkedItems[0]}
                    onChange={(e) => setCheckedItems([e.target.checked, checkedItems[1]])}
                >
                    С детьми
                </Checkbox>
                <Checkbox
                    colorScheme="green"
                    width={"100%"}
                    isChecked={checkedItems[1]}
                    onChange={(e) => setCheckedItems([checkedItems[0], e.target.checked])}
                >
                    С животными
                </Checkbox>
            </HStack>
        </Stack>
    )
}