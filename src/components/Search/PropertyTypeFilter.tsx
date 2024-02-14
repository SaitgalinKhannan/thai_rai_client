import {Select} from '@chakra-ui/react'
import React, {useContext} from 'react';
import {ThaiRaiContext} from '../../context/HouseProvider';

export default function PropertyTypeFilter() {
    const {properties, setProperty} = useContext(ThaiRaiContext);

    const handler = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setProperty(event.target.value);
    };

    return (
        <Select placeholder='Тип недвижимости' onChange={handler}>
            {
                properties.map((property, index) =>
                    <option key={index}>{property}</option>
                )
            }
        </Select>
    );
}