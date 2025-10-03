'use client'

import { LocalizationProvider } from '@mui/x-date-pickers'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

const theme = createTheme()

export default function MuiLocalizationProvider({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                {children}
            </LocalizationProvider>
        </ThemeProvider>
    )
}
