import { MotionButton, MotionDiv, MotionP } from '@/lib/motion'
import { appStore, ESidebarStatus } from '@/shared/stores'
import { Link } from '@tanstack/react-router'
import { useStore } from '@tanstack/react-store'
import { type Variants } from 'motion/react'
import React, { type Dispatch, type SetStateAction } from 'react'
import type { TSidebarItem } from './Sidebar'

const SidebarItem = ({
    data,
    isActivated,
    setActivated,
}: {
    data: TSidebarItem
    isActivated: boolean
    setActivated: Dispatch<SetStateAction<TSidebarItem | null>>
}) => {
    const sidebarStatus = useStore(appStore, (state) => state.sidebarStatus)

    const buttonVariants: Variants = {
        init: {
            opacity: 0,
        },
        animate: {
            opacity: 1,
            color: 'var(--text-subdued)',
        },
        active: {
            opacity: 1,
            color: 'var(--color-default)',
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
            color: 'var(--color-text-default)',
        },
        animate: {
            color: 'var(--color-text-default)',
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
                to={data.path}
                className="grid grid-cols-[16px_1fr] place-items-center"
                title={data.titleKey}
            >
                <div className="w-4 flex items-center">
                    <MotionDiv
                        variants={leftLineVariants}
                        className="ml-1.5 h-4 bg-primary w-0.75 rounded-full"
                    />
                </div>
                <MotionButton
                    variants={buttonVariants}
                    animate="animate"
                    className="w-full group cursor-pointer flex items-center justify-start rounded-lg hover:bg-text-disabled transition duration-200"
                >
                    <div className="py-2 px-2.5">
                        {isActivated ? (
                            <data.iconFill
                                className="text-primary"
                                width={20}
                                height={20}
                            />
                        ) : (
                            <data.icon
                                width={20}
                                height={20}
                                className="text-text-default"
                            />
                        )}
                    </div>

                    {sidebarStatus === ESidebarStatus.EXPAND && (
                        <MotionP
                            variants={textVariants}
                            className={`text-sm ${
                                isActivated ? 'font-semibold text-primary!' : ''
                            } text-nowrap overflow-hidden py-2 pr-2 pl-0.5`}
                        >
                            {data.titleKey}
                        </MotionP>
                    )}
                </MotionButton>
            </Link>
        </MotionDiv>
    )
}

export default React.memo(SidebarItem)
