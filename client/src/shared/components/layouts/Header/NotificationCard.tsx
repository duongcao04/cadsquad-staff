import { NotificationStatus } from '@/shared/enums/notificationStatus.enum'
import { useUpdateNotification } from '@/shared/queries/useNotification'

import { Notification } from '@/shared/interfaces/notification.interface'
import CadsquadLogo from '@/shared/components/CadsquadLogo'
import { Image } from 'antd'

export function NotificationCard({ data }: { data: Notification }) {
    const { mutateAsync: updateNotificationMutate } = useUpdateNotification()

    return (
        <div
            className="grid grid-cols-[50px_1fr_7px] gap-3 items-center"
            onClick={async () => {
                await updateNotificationMutate({
                    id: data.id,
                    data: {
                        status: NotificationStatus.SEEN,
                    },
                })
            }}
        >
            <div className="w-full aspect-square">
                {data?.imageUrl ? (
                    <div className="size-full aspect-square rounded-full">
                        <Image
                            src={data?.imageUrl}
                            alt="Notification image"
                            className="size-full aspect-square rounded-full object-fit"
                            preview={false}
                        />
                    </div>
                ) : (
                    <div className="size-full aspect-square rounded-full grid place-items-center bg-secondary">
                        <CadsquadLogo
                            classNames={{
                                logo: 'p-1.5',
                            }}
                            logoTheme="white"
                        />
                    </div>
                )}
            </div>
            <div className="space-y-1">
                <p className="text-sm font-semibold line-clamp-1">
                    {data?.title}
                </p>
                <p className="text-sm line-clamp-2">{data?.content}</p>
            </div>
            {data.status === NotificationStatus.UNSEEN && (
                <div className="w-full aspect-square rounded-full bg-gray-500"></div>
            )}
        </div>
    )
}
