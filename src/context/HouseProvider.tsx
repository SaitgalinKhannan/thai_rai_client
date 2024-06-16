import React, {createContext, useEffect, useMemo, useState} from "react";
import RealEstateContext, {Filter, RealEstateInterface} from "../api/model";
import {authUser, favoritesHousesList, housesList, userByEmail} from "../api/Data";
import {jwtDecode} from "jwt-decode";

const realEstateContext: RealEstateContext = {
    realEstates: [],
    setHouses() {
    },
    filterProps: null,
    isLoading: false,
    setIsLoading() {
    },
    resetFilter() {
    },
    offset: 0,
    setOffset() {
    },
    filter: null,
    setFilter() {
    }
};

export const ThaiRaiContext = createContext<RealEstateContext>(realEstateContext);

export default function HouseProvider({children}: Readonly<{
    children: React.ReactNode
}>): React.ReactElement<RealEstateContext> {
    const [houses, setHouses] = useState<RealEstateInterface[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [offset, setOffset] = useState(0);
    const limit = 20;
    const [filter, setFilter] = useState<Filter | null>(null)

    const fetchData = async () => {
        setIsLoading(true);
        await housesList({
            limit: limit,
            offset: offset * limit
        }, null).then(data => {
            setHouses(data)
            console.log(data)
        }).catch(e => {
            console.error('Error fetching data:', e);
        })
        setIsLoading(false);
    };

    useEffect(() => {
        if (offset !== 0) {
            housesList({
                limit: limit,
                offset: offset * limit
            }, null).then(data => {
                setHouses(data)
                console.log(data)
            }).catch(e => {
                console.error('Error fetching data:', e);
            })
        }
    }, [offset]);

    useEffect(() => {
        setOffset(0)
        if (filter) {
            housesList({
                limit: limit,
                offset: offset * limit
            }, filter).then(data => {
                setHouses(data)
                console.log(data)
            }).catch(e => {
                console.error('Error fetching data:', e);
            })
        }
    }, [filter]);

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
                    const email = localStorage.getItem('email');
                    const password = localStorage.getItem('password');
                    if (email != null && password != null) {
                        authUser(email, password)
                            .then(tokens => {
                                localStorage.setItem('accessToken', tokens.accessToken);
                                localStorage.setItem('refreshToken', tokens.refreshToken);
                            })
                            .catch(e => {
                                console.error('Error auth user:', e);
                                localStorage.clear();
                            })
                    }
                })
        }
    }

    useEffect(() => {
        fetchData();
        reauthUser();
    }, []);

    const resetFilter = async () => {
        setHouses([])
        setOffset(0)
        await fetchData();
    };

    const obj: RealEstateContext = useMemo(() => ({
        realEstates: houses,
        setHouses: setHouses,
        filterProps: null,
        isLoading: isLoading,
        setIsLoading: setIsLoading,
        resetFilter: resetFilter,
        offset: offset,
        setOffset: setOffset,
        filter: filter,
        setFilter: setFilter,
    }), [houses, isLoading]);

    return (
        <ThaiRaiContext.Provider value={obj}>
            {children}
        </ThaiRaiContext.Provider>
    );
}