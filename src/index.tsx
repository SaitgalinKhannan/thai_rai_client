import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {ChakraProvider} from "@chakra-ui/react";
import {BrowserRouter} from "react-router-dom";
import {theme} from "./Theme";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <ChakraProvider theme={theme}>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </ChakraProvider>
);

reportWebVitals();
