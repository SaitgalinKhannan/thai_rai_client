import React, {useContext, useEffect, useState} from "react";
import {Select} from "@chakra-ui/react";
import {StatusForUsers, statusForUsersMapping} from "../../api/model";
import {SearchContext} from "../../context/SearchProvider";

export default function StatusFilter() {
    const searchContext = useContext(SearchContext)
    const [localStatus, setLocalStatus] = useState<string | null>(statusForUsersMapping[StatusForUsers.SALE])
    const statusSelectHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setLocalStatus(event.target.value)
        searchContext.setStatus(event.target.value)
    }

    useEffect(() => {
            setLocalStatus(searchContext.status)
    }, [searchContext.status]);

    return (
        <Select
            height="44px"
            width="100%"
            variant='filled'
            onChange={statusSelectHandler}
            value={localStatus || statusForUsersMapping[StatusForUsers.SALE]}
        >
            {
                Object.values(StatusForUsers).map((type) => (
                    <option key={type} value={statusForUsersMapping[type]}>
                        {type}
                    </option>
                ))
            }
        </Select>
    )
}