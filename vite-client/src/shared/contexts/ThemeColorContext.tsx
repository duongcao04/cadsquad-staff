'use client'

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
    // 1. Default state
    const [themeColor, setThemeColorState] = useState<ThemeColorKey>('blue')
    const [isMounted, setIsMounted] = useState(false)

    // 2. Helper to apply styles to :root
    const applyThemeToRoot = (key: ThemeColorKey) => {
        const themeParams = APP_THEME_COLORS[key]
        const root = document.documentElement // Targets the <html> tag

        // Loop through the object (e.g., --primary, --primary-50) and set CSS vars
        Object.entries(themeParams).forEach(([property, value]) => {
            root.style.setProperty(property, value)
        })
    }

    // 3. Initial Load (Client-Side Only)
    useEffect(() => {
        setIsMounted(true)
        const stored = localStorage.getItem('theme-color') as ThemeColorKey

        // If we found a stored theme, update state AND apply styles immediately
        if (stored && APP_THEME_COLORS[stored]) {
            setThemeColorState(stored)
            applyThemeToRoot(stored)
        } else {
            // Otherwise apply the default 'blue' to ensure vars are present
            applyThemeToRoot('blue')
        }
    }, [])

    // 4. Handle Theme Switching
    const setThemeColor = (color: ThemeColorKey) => {
        setThemeColorState(color)
        localStorage.setItem('theme-color', color)
        applyThemeToRoot(color) // Apply styles imperatively
    }

    // 5. Render
    // Note: We no longer need the wrapper <div> with inline styles.
    // The variables are now on the <html> tag, so they are global.
    return (
        <ThemeColorContext.Provider value={{ themeColor, setThemeColor }}>
            {/* We still keep a div or generic wrapper if you need base classes,
              but we REMOVED the style={} prop. 
            */}
            <div
                className={`min-h-screen bg-background text-foreground font-sans transition-colors duration-500 ${isMounted ? 'opacity-100' : 'opacity-0'}`}
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
