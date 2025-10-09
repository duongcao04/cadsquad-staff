'use client'

import { cn } from '@/lib/utils'
import { Button, ButtonProps } from '@heroui/react'

export type FeatureCardAction = ButtonProps & {
    key: string
    title: string
    onClick?: () => void
}

export type FeatureCardProps = {
    key?: string
    title: React.ReactNode
    description?: React.ReactNode
    actionButton?: React.ReactNode
    actions?: FeatureCardAction[]
    children?: React.ReactNode
    classNames?: { wrapper?: string }
}
export function FeatureCard({
    title,
    description,
    actionButton,
    actions,
    children,
    classNames,
}: FeatureCardProps) {
    return (
        <div
            className={cn(
                'bg-background rounded-lg shadow-xs',
                classNames?.wrapper
            )}
        >
            <div className="pl-6 pr-4 py-4 flex items-center justify-between">
                <div>
                    <p className="text-xl">{title}</p>
                    <p className="text-text2">{description}</p>
                </div>
                {actionButton}
            </div>
            <div className="pt-8 pl-4 pr-4 pb-10">
                {children && children}
                {!children && (
                    <div className="flex flex-col items-start w-fit gap-0.5">
                        {actions?.map((ac) => {
                            return (
                                <Button
                                    variant="light"
                                    color="primary"
                                    onPress={() => ac.onClick?.()}
                                    {...ac}
                                    key={ac.key}
                                >
                                    <span className="font-semibold">
                                        {ac.title}
                                    </span>
                                </Button>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
