import { Link } from '@tanstack/react-router'
import { Image } from 'antd'
import { Check } from 'lucide-react'
import { useTheme } from 'next-themes'

// import {  APP_TABLE_SIZES } from '@/lib/utils'
import { APP_THEME_COLORS, APP_THEMES } from '@/lib/utils'

export function EditAppearanceForm() {
    const { theme, setTheme } = useTheme()
    // const { table, setTableSize } = useSettingStore()

    return (
        <div className="space-y-8">
            <div className="size-full border-px border-text-muted rounded-xl px-6 py-4">
                <div className="grid grid-cols-[330px_1fr] gap-8">
                    <div>
                        <h2 className="text-base font-semibold">Theme color</h2>
                        <p className="text-xs text-text-subdued">
                            Choose a preferred theme for the app
                        </p>
                    </div>
                    <div className="flex items-center justify-start gap-3 flex-wrap">
                        {APP_THEME_COLORS.map((item, idx) => {
                            const isActivated = APP_THEME_COLORS[0] === item

                            return (
                                <div
                                    key={idx}
                                    className="p-0.5 border-2 rounded-lg"
                                    style={{
                                        borderColor: isActivated
                                            ? item
                                            : 'transparent',
                                    }}
                                >
                                    <div
                                        className="size-8 rounded-md"
                                        style={{
                                            background: item,
                                        }}
                                    />
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
            <div className="size-full border-px border-text-muted rounded-xl px-6 py-4">
                <div className="grid grid-cols-[330px_1fr] gap-8">
                    <div>
                        <h2 className="text-base font-semibold">Theme</h2>
                        <p className="text-xs text-text-subdued">
                            How the theme looks.
                        </p>
                    </div>
                    <div className="flex items-center justify-start gap-6">
                        {APP_THEMES.map((themeI) => {
                            const isActivated = themeI.code === theme
                            return (
                                <div
                                    key={themeI.id}
                                    className="relative flex flex-col items-center gap-1 cursor-pointer"
                                    onClick={() => setTheme(themeI.code)}
                                >
                                    {isActivated && (
                                        <div className="absolute -top-1.25 -right-1.25 z-1">
                                            <Check
                                                size={16}
                                                className="p-0.5 rounded-full bg-primary text-white"
                                            />
                                        </div>
                                    )}
                                    <Image
                                        src={themeI.thumbnail}
                                        alt="Theme thumb"
                                        rootClassName="!h-20 border-[1.5px] p-0.5 size-full rounded-sm"
                                        className="size-full!"
                                        wrapperStyle={{
                                            borderColor: isActivated
                                                ? 'var(--color-primary)'
                                                : 'transparent',
                                        }}
                                        preview={false}
                                    />
                                    <p className="text-xs font-medium text-text-default">
                                        {themeI.title}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
            <div className="size-full border-px border-text-muted rounded-xl px-6 py-4">
                <div className="grid grid-cols-[330px_1fr] gap-8">
                    <div>
                        <h2 className="text-base font-semibold">Tables</h2>
                        <p className="text-xs text-text-subdued">
                            How tables are displayed.
                        </p>
                        <Link
                            to={'/project-center'}
                            className="block mt-1 text-xs font-semibold underline text-primary"
                            target="_blank"
                        >
                            View examples
                        </Link>
                    </div>
                    <div className="flex items-center justify-start gap-6">
                        {/* {appTableSize.map((size) => {
                            // const isActivated = size.code === table.size
                            return (
                                <div
                                    key={size.id}
                                    className="relative flex flex-col items-center gap-1 cursor-pointer"
                                    // onClick={() => setTableSize(size.code)}
                                >
                                    {true && (
                                        <div className="absolute -top-[5px] -right-[5px] z-1">
                                            <Check
                                                size={16}
                                                className="p-0.5 rounded-full bg-primary text-white"
                                            />
                                        </div>
                                    )}
                                    <Image
                                        src={size.thumbnail}
                                        alt="Theme thumb"
                                        rootClassName="!h-20 border-[1.5px] p-0.5 size-full rounded-sm"
                                        className="!size-full"
                                        wrapperStyle={{
                                            borderColor: true
                                                ? 'var(--color-primary)'
                                                : 'transparent',
                                        }}
                                        preview={false}
                                    />
                                    <p className="text-xs font-medium text-text-default">
                                        {size.title}
                                    </p>
                                </div>
                            )
                        })} */}
                        Feature under development
                    </div>
                </div>
            </div>
        </div>
    )
}
