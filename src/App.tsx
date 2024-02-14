import React from 'react';
import './App.css';
import {Outlet, Route, Routes} from "react-router-dom";
import Home from "./routes/Home";
import {Container} from "@chakra-ui/react";
import Header from "./components/Header/Header";
import HouseProvider from "./context/HouseProvider";
import PropertyDetails from "./routes/PropertyDetails";
import HouseDetails from "./components/PropertyDetails/HouseDetails";
import NewHouseDetails from "./components/PropertyDetails/NewHouse";
import SignIn from "./components/Auth/SignIn";
import SignUp from "./components/Auth/SignUp";

const AppLayout = () => (
    <HouseProvider>
        <Container maxW={{base: '100%', md: '70%'}} px='5'>
            <Header/>
            <Outlet />
        </Container>
    </HouseProvider>
);

const LoginLayout = () => (
    <Container maxW={{base: '100%', md: '70%'}} px='5'>
        <Outlet />
    </Container>
);

function App() {
    return (
        <Routes>
            <Route path="/" element={<AppLayout/>}>
                <Route index element={<Home/>}/>
                <Route path='property-details' element={<PropertyDetails/>}>
                    <Route path=":propertyId" element={<HouseDetails/>}/>
                </Route>
                <Route path='/add-house' element={<NewHouseDetails/>}/>
                <Route path="*"
                       element={
                           <main style={{padding: "1rem"}}>
                               <p>There's nothing here!</p>
                           </main>
                       }
                />
            </Route>
            <Route path="/login" element={<LoginLayout />}>
                <Route index element={<SignIn />} />
                <Route path="signin" element={<SignIn />} />
                <Route path="signup" element={<SignUp />} />
            </Route>
        </Routes>
    );
}

export default App;