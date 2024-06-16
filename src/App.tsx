import React, {useEffect, useState} from 'react';
import './App.css';
import {Outlet, Route, Routes} from "react-router-dom";
import Home from "./routes/Home";
import {ChakraProvider, Container, useBreakpointValue} from "@chakra-ui/react";
import Header from "./components/Header/Header";
import HouseProvider from "./context/HouseProvider";
import PropertyDetails from "./routes/PropertyDetails";
import HouseDetails from "./components/PropertyDetails/HouseDetails";
import NewHouseDetails from "./components/PropertyDetails/NewHouse";
import SignIn from "./components/Auth/SignIn";
import {UserProfile} from "./components/Profile/UserProfile";
import UpdateRealEstate from "./components/PropertyDetails/UpdateRealEstate";
import NewNavMobile from "./components/Header/NewNavMobile";
import {FavoriteHouseList} from "./components/Houses/FavoriteHouseList";
import {MyRealEstates} from "./components/Houses/MyRealEstates";
import SignUp from "./components/Auth/SignUp";
import {muiTheme, theme} from "./Theme";
import ChatProvider from "./context/ChatProvider";
import Messages from "./components/Chat/Messages";
import {Box, ThemeProvider} from "@mui/material";
import ChatRooms from "./components/Chat/ChatRooms";
import MobileChatRooms from "./components/Chat/MobileChatRooms";

export function isMobileScreen() {
    const screenWidth = window.innerWidth;
    const mobileThreshold = 768;

    return screenWidth <= mobileThreshold;
}

const AppLayout = () => {
    const isMobile = useBreakpointValue({base: true, lg: false})
    return (
        <HouseProvider>
            {!isMobile && (
                <Header/>
            )}
            <Container maxW={{base: '100%', lg: '90%', xl: "70%"}} marginBottom="50px" padding={0}>
                <Outlet/>
            </Container>
            {isMobile && (
                <NewNavMobile/>
            )}
        </HouseProvider>
    );
}

const ChatLayout = () => {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(isMobileScreen());
        };

        // Установить начальное значение isMobile
        handleResize();

        // Добавить обработчик события resize
        window.addEventListener('resize', handleResize);

        // Очистить обработчик при размонтировании компонента
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <>
            <ChatProvider>
                <Box sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Outlet/>
                </Box>
                {isMobile && <NewNavMobile/>}
            </ChatProvider>
        </>
    );
}

function App() {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(isMobileScreen());
        };

        // Установить начальное значение isMobile
        handleResize();

        // Добавить обработчик события resize
        window.addEventListener('resize', handleResize);

        // Очистить обработчик при размонтировании компонента
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <Routes>
            <Route path="/" element={
                <ChakraProvider theme={theme}>
                    <AppLayout/>
                </ChakraProvider>
            }>
                <Route index element={<Home/>}/>
                <Route path='house' element={<PropertyDetails/>}>
                    <Route path=":houseId" element={<HouseDetails/>}/>
                </Route>
                <Route path="/edit" element={<UpdateRealEstate/>}/>
                <Route path='/add-house' element={<NewHouseDetails/>}/>
                <Route path='/profile' element={<UserProfile/>}/>
                <Route path='/favorites' element={<FavoriteHouseList/>}/>
                <Route path='/my' element={<MyRealEstates/>}/>
                <Route path="/signin" element={<SignIn/>}/>
                <Route path="/new-account" element={<SignUp/>}/>
                <Route path="*"
                       element={
                           <main style={{padding: "1rem"}}>
                               <p>There's nothing here!</p>
                           </main>
                       }
                />
            </Route>

            <Route path="/chats" element={
                <ThemeProvider theme={muiTheme}>
                    <ChatLayout/>
                </ThemeProvider>
            }>
                <Route index element={isMobile ? <MobileChatRooms/> : <ChatRooms/>}/>
                <Route path=':chatId' element={isMobile ? <Messages/> : <ChatRooms/>}/>
            </Route>
        </Routes>
    );
}

export default App;