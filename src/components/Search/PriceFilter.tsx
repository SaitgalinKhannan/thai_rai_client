import {Select} from "@chakra-ui/react";
import React, {useContext} from "react";
import {ThaiRaiContext} from "../../context/HouseProvider";

export default function PriceFilter() {
    const {setPrice} = useContext(ThaiRaiContext);

    const prices = [
        {value: "5000 - 10000"},
        {value: "10000 - 15000"},
        {value: "150000 - 20000"},
        {value: "20000 - 25000"},
        {value: "25000 - 30000"},
        {value: "30000 - 35000"},
        {value: "50000 - 150000"}
    ];

    const priceHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setPrice(event.target.value);
    };

    return (
        <Select placeholder="Цена" onChange={priceHandler}>
            {
                prices.map((price, index) =>
                    <option key={index}>{price.value}</option>
                )
            }
        </Select>
    );
};