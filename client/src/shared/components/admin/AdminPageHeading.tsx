import { cn } from '@/lib'
import { Card, CardBody, CardProps } from '@heroui/react'

type Props = {
    title: React.ReactNode
    description?: React.ReactNode
    actions?: React.ReactNode
    classNames?: {
        base?: string
        titleWrapper?: string
        title?: string
        description?: string
        actionsWrapper?: string
    }
} & CardProps
export function AdminPageHeading({
    title,
    description,
    actions,
    classNames,
    ...props
}: Props) {
    return (
        <Card
            {...props}
            shadow={props.shadow ?? 'sm'}
            className={cn('border-none m-2', props.className)}
        >
            <CardBody
                className={cn(
                    'flex flex-row justify-between items-center p-6',
                    classNames?.base
                )}
            >
                <div className={cn(classNames?.titleWrapper)}>
                    <h1
                        className={cn(
                            'text-2xl font-bold text-text-default',
                            classNames?.title
                        )}
                    >
                        {title}
                    </h1>
                    <p
                        className={cn(
                            'text-sm text-text-subdued',
                            classNames?.description
                        )}
                    >
                        {description}
                    </p>
                </div>
                <div className={classNames?.actionsWrapper}>{actions}</div>
            </CardBody>
        </Card>
    )
}
