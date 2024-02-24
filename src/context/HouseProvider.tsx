import React, {useEffect, useMemo, useState} from "react";
import RealEstateContext from "../api/model";
import {housesList, userByEmail} from "../api/Data";
import {jwtDecode} from "jwt-decode";

const realEstateContext: RealEstateContext = {
    realEstates: [],
    setHouses() {
    },
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
        await housesList({
            limit: limit,
            offset: offset * limit
        }).then(data => {
            setHouses(data)
        }).catch(e => {
            console.error('Error fetching data:', e);
        })
    };

    const reauthUser = async () => {
        const token = localStorage.getItem('accessToken')
        if (token != null && jwtDecode(token).sub != null) {
            const sub = jwtDecode(token).sub!!
            await userByEmail(sub, token)
                .then(user => {
                    localStorage.setItem('userId', user.id.toString());
                    localStorage.setItem('firstName', user.firstName);
                    localStorage.setItem('lastName', user.lastName);
                    localStorage.setItem('email', user.email);
                    localStorage.setItem('phone', user.phone);
                    localStorage.setItem('role', user.role);
                })
                .catch(e => {
                    console.error('Error reauth user:', e);
                })
        }
    }

    useEffect(() => {
        fetchData();
        reauthUser();
    }, []);

    useEffect(() => {
        const allCities = houses.map(house => house.address.region);
        const uniqueCities = [...new Set(allCities)];
        setCities(uniqueCities);

        const allPropertyTypes = houses.map(house => house.type)
        const uniquePropertyTypes = [...new Set(allPropertyTypes)];
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
        setHouses: setHouses,
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