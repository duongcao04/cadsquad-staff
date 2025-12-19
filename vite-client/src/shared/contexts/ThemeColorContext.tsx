import { APP_THEME_COLORS } from '@/lib/utils'
import React, { createContext, useContext, useEffect, useState } from 'react'

export type ThemeColorKey = keyof typeof APP_THEME_COLORS

interface ThemeColorContextType {
    themeColor: ThemeColorKey
    setThemeColor: (color: ThemeColorKey) => void
}

const ThemeColorContext = createContext<ThemeColorContextType | undefined>(
    undefined
)

export const ThemeColorProvider = ({
    children,
}: {
    children: React.ReactNode
}) => {
    // 1. Default state to 'blue' to ensure Server and Client match initially
    const [themeColor, setThemeColorState] = useState<ThemeColorKey>('blue')
    const [_, setIsMounted] = useState(false)

    // 2. Perform localStorage check ONLY after mounting (Client-side only)
    useEffect(() => {
        setIsMounted(true)
        const stored = localStorage.getItem('theme-color') as ThemeColorKey
        if (stored && APP_THEME_COLORS[stored]) {
            setThemeColorState(stored)
        }
    }, [])

    const setThemeColor = (color: ThemeColorKey) => {
        setThemeColorState(color)
        localStorage.setItem('theme-color', color)
    }

    const themeStyles = APP_THEME_COLORS[themeColor] as React.CSSProperties

    // 3. Prevent hydration mismatch flicker by not rendering specific theme styles
    // until mounted, OR accept that the first paint is 'blue'.
    // This return renders the children immediately but applies the theme
    // ensuring the HTML structure is consistent.

    return (
        <ThemeColorContext.Provider value={{ themeColor, setThemeColor }}>
            {/* UPDATES:
         1. Removed hardcoded 'bg-slate-50 text-slate-900'.
         2. Used 'bg-background text-foreground' to utilize your CSS variables.
         3. Added 'transition-colors' to smooth the theme switch.
      */}
            <div
                style={themeStyles}
                className="min-h-screen bg-background text-foreground font-sans transition-colors duration-500"
            >
                {children}
            </div>
        </ThemeColorContext.Provider>
    )
}

export const useThemeColor = () => {
    const context = useContext(ThemeColorContext)
    if (!context) {
        throw new Error(
            'useThemeColor must be used within a ThemeColorProvider'
        )
    }
    return context
}
