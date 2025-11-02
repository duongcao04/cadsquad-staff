import { useComments } from '@/lib/queries'
import { CommentRefAll } from '@/shared/types'
import { Spinner } from '@heroui/react'
import { useTranslations } from 'next-intl'
import { CommentCard } from '../cards'

type Props = {
    jobId?: string
}
export function CommentTab({ jobId }: Props) {
    const t = useTranslations()
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
                    <div className="flex flex-col items-center justify-center gap-0.5 text-defaultp5 pt-6 pb-8">
                        <h3 className="text-sm font-semibold">
                            {t('noComments')}
                        </h3>
                        <p className="mt-0.5 text-xs">{t('noCommentsDesc')}</p>
                    </div>
                )}
            </div>
        </div>
    )
}
