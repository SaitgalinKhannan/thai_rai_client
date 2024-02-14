import { extendTheme, theme as base } from "@chakra-ui/react"

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
            body: {
                bg: '#fff'
            }
        }
    },
    components: {
        Button: {
            defaultProps: {
                colorScheme: 'telegram',
            }
        },
        Input:{
            defaultProps: {
                focusBorderColor: 'telegram.500'
            }
        },
        Select:{
            baseStyle: {
                _focus: {
                    borderColor: 'telegram.500'
                }
            }
        },
        Textarea:{
            defaultProps: {
                focusBorderColor: 'telegram.500'
            }
        }
    }
});