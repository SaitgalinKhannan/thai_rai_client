import React, {useContext} from "react";
import {ThaiRaiContext} from "../../context/HouseProvider";
import {Select} from "@chakra-ui/react";
import {BuildingType, buildingTypeMapping, StatusForUsers, statusForUsersMapping} from "../../api/model";
import {SearchContext} from "../../context/SearchProvider";

export default function BuildingTypeFilter() {
    const {setBuildingType} = useContext(SearchContext)
    const buildingTypeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setBuildingType(event.target.value)
    }

    return (
        <Select
            height="44px"
            width="100%"
            variant="filled"
            defaultValue={buildingTypeMapping[BuildingType.APARTMENT]}
            onChange={buildingTypeHandler}
        >
            {
                Object.values(BuildingType).map((type) => (
                    <option key={type} value={buildingTypeMapping[type]}>
                        {type}
                    </option>
                ))
            }
        </Select>
    )
}