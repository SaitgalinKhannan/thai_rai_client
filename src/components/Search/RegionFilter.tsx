import React, {useContext} from "react";
import {Select} from "@chakra-ui/react";
import {ThaiRaiContext} from "../../context/HouseProvider";
import {SearchContext} from "../../context/SearchProvider";
import {Status, statusMapping} from "../../api/model";
import {regionsInCity} from "../../data/Address";
import {useTranslation} from "react-i18next";

export default function RegionFilter() {
    const {setTambon} = useContext(SearchContext)
    const locationHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setTambon(event.target.value);
    }
    const {t}=useTranslation();

    return (
        <Select
            variant='filled'
            height="44px"
            width="100%"
            placeholder={t('district')}
            onChange={locationHandler}>
            {
                regionsInCity.map((region, index) => (
                    <option key={index} value={region}>
                        {region}
                    </option>
                ))
            }
        </Select>
    );
};