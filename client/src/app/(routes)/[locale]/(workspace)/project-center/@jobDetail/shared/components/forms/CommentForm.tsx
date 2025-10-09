import { ApiError } from '@/lib/axios'
import { HeroButton, QuillEditor } from '@/shared/components'
import { useCreateComment, useProfile } from '@/shared/queries'
import { addToast } from '@heroui/react'
import { Image } from 'antd'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

type Props = { jobId: string; parentId?: string | null; isReply?: boolean }
export function CommentForm({ jobId, parentId, isReply = false }: Props) {
    const { mutateAsync: createCommentMutation, isPending: isLoading } =
        useCreateComment()
    const { profile } = useProfile()
    const t = useTranslations()

    const [commentValue, setCommentValue] = useState<string | null>(null)

    const handleComment = async () => {
        if (!commentValue) {
            addToast({
                title: t('commentCannotBeEmpty'),
                color: 'danger',
            })
        } else {
            await createCommentMutation(
                {
                    userId: profile?.id ?? '',
                    content: commentValue,
                    jobId: jobId,
                    parentId: parentId,
                },
                {
                    onSuccess(res) {
                        addToast({
                            title: res?.data.message,
                            color: 'success',
                        })
                        setCommentValue(null)
                    },
                    onError(error) {
                        const err = error as unknown as ApiError
                        addToast({
                            title: err?.message,
                            color: 'danger',
                        })
                    },
                }
            )
        }
    }

    return (
        <div className="w-full mt-4 flex items-start justify-start gap-3">
            <Image
                preview={false}
                src={profile?.avatar || ''}
                alt={profile?.displayName}
                rootClassName="size-10 rounded-full"
                className="size-10 rounded-full"
            />
            <div className="w-full space-y-3">
                <div className="w-full flex items-center justify-between gap-2">
                    <p className="pt-1 font-medium text-base">
                        {isReply ? t('reply') : t('addAComment')}
                    </p>
                    <HeroButton
                        color="blue"
                        variant="solid"
                        onPress={handleComment}
                        isLoading={isLoading}
                    >
                        {t('submit')}
                    </HeroButton>
                </div>
                <div className="w-full">
                    <QuillEditor
                        defaultValue={commentValue ?? ''}
                        onChange={(value) => {
                            if (value === '') {
                                setCommentValue(null)
                            } else {
                                setCommentValue(value)
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    )
}
