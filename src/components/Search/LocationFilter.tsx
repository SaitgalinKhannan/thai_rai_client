import React, {useContext} from "react";
import {Select} from "@chakra-ui/react";
import {ThaiRaiContext} from "../../context/HouseProvider";

export default function LocationFilter() {
    const {cities, setCity} = useContext(ThaiRaiContext);

    const locationHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setCity(event.target.value);
    }

    return (
        <Select placeholder='Провинция' onChange={locationHandler}>
            {
                cities.map((city, index) =>
                    <option key={index}>{city}</option>
                )
            }
        </Select>
    );
};