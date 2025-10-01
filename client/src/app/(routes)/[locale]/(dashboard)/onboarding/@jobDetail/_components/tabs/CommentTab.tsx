import React from 'react'
import { Spinner } from '@heroui/react'
import { useComments } from '@/shared/queries/useComment'
import { CommentRefAll } from '@/shared/types/comment.type'
import CommentCard from '../cards/CommentCard'

type Props = {
    jobId?: string
}
export default function CommentTab({ jobId }: Props) {
    const { comments, isLoading } = useComments(jobId)

    if (!jobId || isLoading) {
        return <Spinner />
    }

    return (
        <div>
            <div className="space-y-6">
                {comments?.length ? (
                    comments?.map((cmt) => {
                        return (
                            <div key={cmt.id}>
                                <CommentCard data={cmt as CommentRefAll} />
                                {cmt?.replies && (
                                    <ul className="mt-4 space-y-4">
                                        {cmt?.replies?.map((cmtReply) => {
                                            return (
                                                <li
                                                    key={cmtReply.id}
                                                    className="ml-8 scale-90"
                                                >
                                                    <CommentCard
                                                        data={
                                                            cmtReply as CommentRefAll
                                                        }
                                                        defaultShowReply={false}
                                                        isReply={false}
                                                    />
                                                </li>
                                            )
                                        })}
                                    </ul>
                                )}
                            </div>
                        )
                    })
                ) : (
                    <div className="flex flex-col items-center justify-center gap-0.5 text-text1p5 pt-6 pb-8">
                        <h3 className="text-sm font-semibold">
                            Không có bình luận
                        </h3>
                        <p className="mt-0.5 text-xs">
                            Hiện tại chưa có bình luận nào. Hãy theo dõi để xem
                            các cập nhật mới nhất.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
