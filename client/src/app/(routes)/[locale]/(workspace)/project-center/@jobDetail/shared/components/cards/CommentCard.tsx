import { SwitchDateFormat } from '@/shared/components'
import { CommentRefAll } from '@/shared/types'
import { Image } from 'antd'
import { useState } from 'react'
import { CommentForm } from '../forms'

export const CommentCard = ({
    data,
    defaultShowReply = false,
    isReply = true,
}: {
    data: CommentRefAll
    defaultShowReply?: boolean
    isReply?: boolean
}) => {
    const [showReply, setShowReply] = useState(defaultShowReply)
    return (
        <div className="grid grid-cols-[48px_1fr] gap-2">
            <Image
                src={String(data?.user?.avatar)}
                alt="user avatar"
                preview={false}
                rootClassName="!size-11 !rounded-full"
                className="!size-full !rounded-full"
            />
            <div>
                <div className="pl-3 pr-4 py-2 w-fit bg-background2 rounded-xl">
                    <p className="font-semibold">{data?.user?.displayName}</p>
                    <div
                        dangerouslySetInnerHTML={{ __html: data.content }}
                    ></div>
                </div>
                <div className="mt-1 ml-2.5 flex items-center justify-start gap-3">
                    <SwitchDateFormat data={data.createdAt} />
                    {isReply && (
                        <button
                            className="text-xs text-text2 hover:underline cursor-pointer"
                            onClick={() => {
                                setShowReply(!showReply)
                            }}
                        >
                            Phản hồi
                        </button>
                    )}
                </div>
                {showReply && (
                    <div>
                        <CommentForm
                            jobId={data.jobId}
                            parentId={data.id}
                            isReply={isReply}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}
