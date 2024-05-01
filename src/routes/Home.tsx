import HouseList from "../components/Houses/HouseList";
import Search from "../components/Search/Search";
import SearchProvider from "../context/SearchProvider";

export default function Home() {
    return (
        <>
            <SearchProvider>
                <Search/>
            </SearchProvider>
            <HouseList/>
        </>
    )
}