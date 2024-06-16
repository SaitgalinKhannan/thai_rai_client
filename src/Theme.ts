import { extendTheme, theme as base } from "@chakra-ui/react"
import {createTheme} from "@mui/material";

export const breakpoints = {
    sm: '320px',
    md: '500px',
    lg: '720px',
    xl: '960px',
    '2xl': '1200px',
}

export const theme = extendTheme({
    breakpoints,
    fonts: {
        heading: `'Roboto Slab', ${base.fonts.heading}`,
        body: `'Montserrat', sans-serif`,
    },
    styles: {
        global: {
            colorScheme: 'green',
            body: {
                bg: '#fff'
            }
        }
    },
    components: {
        Button: {
            defaultProps: {
                colorScheme: 'green',
            }
        },
        NumberInput:{
            defaultProps: {
                focusBorderColor: '#2d9d92'
            }
        },
        Input:{
            defaultProps: {
                focusBorderColor: '#2d9d92'
            }
        },
        Select:{
            defaultProps: {
                focusBorderColor: '#2d9d92'
            },
            baseStyle: {
                _focus: {
                    borderColor: "#2d9d92"
                }
            }
        },
        Textarea:{
            defaultProps: {
                focusBorderColor: '#2d9d92'
            }
        },
        Checkbox: {
            defaultProps: {
                focusBorderColor: 'green'
            }
        }
    }
});

export const muiTheme = createTheme({
    palette: {
        primary: {
            main: '#2d9d92',
            light: '#7aa8a4',
            dark: '#289085',
            contrastText: '#242105'
        },
        secondary: {
            main: '#8bc1bc',
            light: '#7aa8a4',
            dark: '#289085',
            contrastText: '#242105'
        }
    },
});