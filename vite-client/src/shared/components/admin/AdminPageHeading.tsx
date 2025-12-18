import { cn } from '@/lib/utils'

type Props = {
    breadcrumbs?: React.ReactNode
    title: React.ReactNode
    description?: string
    classNames?: {
        wrapper?: string
    }
    rightButton?: React.ReactNode
}
export function AdminPageHeading({
    title,
    classNames,
    breadcrumbs,
    description,
    rightButton,
}: Props) {
    return (
        <div
            className={cn(
                'w-full pt-2 pb-5 py-3 pl-6 pr-3.5 border-b border-border-default',
                classNames?.wrapper
            )}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center justify-start">
                    <div>
                        <h1 className="align-middle font-medium text-lg">
                            {title}
                        </h1>
                        {description && (
                            <p className="text-text-subdued text-xs">
                                {description}
                            </p>
                        )}
                    </div>
                    {breadcrumbs && (
                        <div className="h-full flex items-end justify-start text-text-muted">
                            <div className="w-px h-5 ml-8 mr-6 bg-text-disabled"></div>
                            {breadcrumbs}
                        </div>
                    )}
                </div>
                {rightButton}
            </div>
        </div>
    )
}
