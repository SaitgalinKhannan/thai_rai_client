import React, {createContext, useContext, useMemo, useState} from "react";
import {
    AdditionalFilter,
    BuildingType,
    buildingTypeMapping, Filter, FilterProps,
    StatusForUsers,
    statusForUsersMapping
} from "../api/model";
import {useDisclosure} from "@chakra-ui/react";
import {ThaiRaiContext} from "./HouseProvider";

const searchContext: FilterProps = {
    buildingType: null,
    setBuildingType() {
    },
    status: null,
    setStatus() {
    },
    tambon: null,
    setTambon() {
    },
    areaFrom: null,
    setAreaFrom() {
    },
    areaTo: null,
    setAreaTo() {
    },
    priceFrom: null,
    setPriceFrom() {
    },
    priceTo: null,
    setPriceTo() {
    },
    newBuilding: null,
    setNewBuilding() {
    },
    roomItems: [],
    setRoomItems() {
    },
    interiorItems: [],
    setInteriorItems() {
    },
    facilityItems: [],
    setFacilityItems() {
    },
    rentTime: null,
    setRentTime() {
    },
    ruleItems: [],
    setRuleItems() {
    },

    isOpen: false,
    onOpen() {
    },
    onClose() {
    },
    searchHandler() {
    },
    resetFilters() {
    }
}

export const SearchContext = createContext<FilterProps>(searchContext);

export default function SearchProvider({children}: Readonly<{
    children: React.ReactNode
}>): React.ReactElement<FilterProps> {
    const [buildingType, setBuildingType] = useState(buildingTypeMapping[BuildingType.APARTMENT]);
    const [status, setStatus] = useState(statusForUsersMapping[StatusForUsers.SALE]);
    const [tambon, setTambon] = useState<string | null>(null);
    const [priceFrom, setPriceFrom] = useState<number | null>(null);
    const [priceTo, setPriceTo] = useState<number | null>(null);
    const [areaFrom, setAreaFrom] = useState<number | null>(null);
    const [areaTo, setAreaTo] = useState<number | null>(null);
    const [newBuilding, setNewBuilding] = useState<boolean | null>(null);
    const [roomItems, setRoomItems] = useState([false, false, false, false, false, false, false])
    const {isOpen, onOpen, onClose} = useDisclosure()

    const [interiorItems, setInteriorItems] = useState([false, false, false, false, false, false, false])
    const [facilityItems, setFacilityItems] = useState([false, false, false, false, false, false, false])
    const [rentTime, setRentTime] = useState<string | null>(null)
    const [ruleItems, setRuleItems] = useState([false, false])
    const {setFilter} = useContext(ThaiRaiContext)

    const resetFilters = () => {
        setBuildingType(buildingTypeMapping[BuildingType.APARTMENT])
        setStatus(statusForUsersMapping[StatusForUsers.SALE])
        setTambon(null)
        setPriceFrom(null)
        setPriceTo(null)
        setAreaFrom(null)
        setAreaTo(null)
        setNewBuilding(null)
        setRoomItems([false, false, false, false, false, false, false])
        setInteriorItems([false, false, false, false, false, false, false])
        setFacilityItems([false, false, false, false, false, false, false])
        setRentTime(null)
        setRuleItems([false, false])
        setFilter(null)
    }

    const searchHandler = () => {
        let additionalFilter: AdditionalFilter | null = null

        if (interiorItems.some(value => value) || facilityItems.some(value => value) || rentTime || ruleItems.some(value => value)) {
            additionalFilter = {
                interiorItems: interiorItems,
                facilityItems: facilityItems,
                rentTime: rentTime,
                ruleItems: ruleItems
            }
        }

        const filter: Filter = {
            buildingType: buildingType,
            status: status,
            tambon: tambon,
            areaFrom: areaFrom,
            areaTo: areaTo,
            priceFrom: priceFrom,
            priceTo: priceTo,
            newBuilding: newBuilding,
            roomItems: roomItems,
            additionalFilter: additionalFilter
        }

        setFilter(filter)
        console.log(filter)
    }

    const obj: FilterProps = useMemo(() => ({
        buildingType: buildingType,
        setBuildingType: setBuildingType,
        status: status,
        setStatus: setStatus,
        tambon: tambon,
        setTambon: setTambon,
        areaFrom: areaFrom,
        setAreaFrom: setAreaFrom,
        areaTo: areaTo,
        setAreaTo: setAreaTo,
        priceFrom: priceFrom,
        setPriceFrom: setPriceFrom,
        priceTo: priceTo,
        setPriceTo: setPriceTo,
        newBuilding: newBuilding,
        setNewBuilding: setNewBuilding,
        roomItems: roomItems,
        setRoomItems: setRoomItems,
        interiorItems: interiorItems,
        setInteriorItems: setInteriorItems,
        facilityItems: facilityItems,
        setFacilityItems: setFacilityItems,
        rentTime: rentTime,
        setRentTime: setRentTime,
        ruleItems: ruleItems,
        setRuleItems: setRuleItems,
        isOpen: isOpen,
        onOpen: onOpen,
        onClose: onClose,
        searchHandler: searchHandler,
        resetFilters: resetFilters
    }), [buildingType, status, tambon, priceFrom, priceTo, areaFrom, areaTo, newBuilding, roomItems, interiorItems, facilityItems, rentTime, ruleItems, isOpen]);

    return (
        <SearchContext.Provider value={obj}>
            {children}
        </SearchContext.Provider>
    );
}