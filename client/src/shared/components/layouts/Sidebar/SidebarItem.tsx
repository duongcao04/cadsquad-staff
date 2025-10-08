import { type SidebarItem } from '@/app/(routes)/[locale]/(workspace)/shared/actions/sidebarActions'
import { Link } from '@/i18n/navigation'
import { MotionButton, MotionDiv, MotionP } from '@/lib/motion'
import { Variants } from 'motion/react'
import { useTranslations } from 'next-intl'
import React, { Dispatch, SetStateAction } from 'react'
import { ESidebarStatus, useUiStore } from '../../../stores/uiStore'

const SidebarItem = ({
    data,
    isActivated,
    setActivated,
}: {
    data: SidebarItem
    isActivated: boolean
    setActivated: Dispatch<SetStateAction<SidebarItem | null>>
}) => {
    const { sidebarStatus } = useUiStore()
    const t = useTranslations()

    const buttonVariants: Variants = {
        init: {
            opacity: 0,
        },
        animate: {
            opacity: 1,
            color: 'var(--text-1p5)',
        },
        active: {
            opacity: 1,
            color: 'var(--color-text1)',
        },
        hover: {
            opacity: 1,
        },
    }
    const leftLineVariants: Variants = {
        init: {
            opacity: 0,
            background: 'hsl(0,0%,80%)',
            transition: {
                duration: 0.1,
            },
        },
        animate: {
            opacity: 1,
            background: 'var(--color-primary)',
            transition: {
                duration: 0.1,
            },
        },
        hover: {
            opacity: 1,
            background: 'hsl(0,0%,80%)',
            transition: {
                duration: 0.1,
            },
        },
    }

    const textVariants: Variants = {
        init: {
            color: 'var(--color-text1p5)',
        },
        animate: {
            color: 'var(--color-text1)',
        },
    }

    return (
        <MotionDiv
            className="size-full"
            initial="init"
            animate={isActivated ? 'animate' : 'init'}
            whileHover={!isActivated ? 'hover' : 'animate'}
            onClick={() => setActivated(data)}
        >
            <Link
                href={data.path}
                prefetch
                passHref
                className="grid grid-cols-[16px_1fr] place-items-center"
                title={t(data.titleKey)}
            >
                <div className="w-4 flex items-center">
                    <MotionDiv
                        variants={leftLineVariants}
                        className="ml-1.5 h-4 bg-primary w-[3px] rounded-full"
                    />
                </div>
                <MotionButton
                    variants={buttonVariants}
                    animate="animate"
                    className="w-full group cursor-pointer flex items-center justify-start rounded-lg hover:bg-[hsl(0,0%,93%)] transition duration-200"
                >
                    <div className="py-2 px-2.5">
                        {isActivated ? (
                            <data.iconFill
                                className="text-primary"
                                width={20}
                                height={20}
                            />
                        ) : (
                            <data.icon width={20} height={20} />
                        )}
                    </div>

                    {sidebarStatus === ESidebarStatus.EXPAND && (
                        <MotionP
                            variants={textVariants}
                            className={`text-sm ${
                                isActivated ? 'font-semibold' : ''
                            } text-nowrap overflow-hidden py-2 pr-2 pl-0.5`}
                        >
                            {t(data.titleKey)}
                        </MotionP>
                    )}
                </MotionButton>
            </Link>
        </MotionDiv>
    )
}

export default React.memo(SidebarItem)
