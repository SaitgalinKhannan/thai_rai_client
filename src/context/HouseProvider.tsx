import React, {useEffect, useMemo, useRef, useState} from "react";
import RealEstateContext from "../data";
import {housesList} from "../api/Data";

const realEstateContext: RealEstateContext = {
    realEstates: [],
    city: '',
    setCity() {
    },
    price: '',
    setPrice() {
    },
    property: '',
    setProperty() {
    },
    cities: [],
    properties: [],
    isLoading: false,
    searchHandler: () => {
    },
    resetFilter: () => {
    },
    offset: 0,
    setOffset() {
    }
};

export const ThaiRaiContext = React.createContext<RealEstateContext>(realEstateContext);

export default function HouseProvider({children}: Readonly<{
    children: React.ReactNode
}>): React.ReactElement<RealEstateContext> {
    const [houses, setHouses] = useState(realEstateContext.realEstates);
    const [city, setCity] = useState('Select City');
    const [price, setPrice] = useState('Select Price');
    const [property, setProperty] = useState('Select type');
    const [isLoading, setIsLoading] = useState(false);
    const [cities, setCities] = useState<string[]>([]);
    const [properties, setProperties] = useState<string[]>([]);
    const [offset, setOffset] = useState(0);
    const limit = 20;

    const fetchData = async () => {
        try {
            const data = await housesList({
                limit: limit,
                offset: offset * limit
            });
            setHouses([...houses, ...data])
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [offset]);

    useEffect(() => {
        const allCities = houses.map(house => house.address.region);
        const uniqueCities = Array.from(new Set(allCities));
        setCities(uniqueCities);
    }, [houses]);

    useEffect(() => {
        const allPropertyTypes = houses.map(house => house.type)
        const uniquePropertyTypes = Array.from(new Set(allPropertyTypes));
        setProperties(uniquePropertyTypes);
    }, [houses]);

    function searchHandler() {
        setIsLoading(true);

        const isDefault = (str: string) => {
            return str.split(' ').includes('Select');
        };

        const minPrice = parseInt(price.split(' ')[0]);
        const maxPrice = parseInt(price.split('- ')[1]);

        const filteredHouses = houses.filter((house) => {
            const housePrice = house.price;

            return (isDefault(city) || house.address.region === city) &&
                (isDefault(price) ||
                    (housePrice >= minPrice && housePrice <= maxPrice)) &&
                (isDefault(property) || house.type === property);
        });

        setTimeout(() => {
            setHouses(filteredHouses);
            setIsLoading(false);
        }, 1000);
    }


    const resetFilter = async () => {
        setHouses([])
        setOffset(0)
        await fetchData();
    };

    const obj: RealEstateContext = useMemo(() => ({
        realEstates: houses,
        city: city,
        setCity: setCity,
        price: price,
        setPrice: setPrice,
        property: property,
        setProperty: setProperty,
        cities: cities,
        properties: properties,
        isLoading: isLoading,
        searchHandler: searchHandler,
        resetFilter: resetFilter,
        offset: offset,
        setOffset: setOffset
    }), [houses, city, setCity, price, setPrice, property, setProperty, cities, properties, isLoading, searchHandler]);

    return (
        <ThaiRaiContext.Provider value={obj}>
            {children}
        </ThaiRaiContext.Provider>
    );
}