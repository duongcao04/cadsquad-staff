import { HeroButton } from '@/shared/components/customize/HeroButton'
import { Image } from 'antd'
import useAuth from '@/shared/queries/useAuth'
import QuillEditor from '@/shared/components/editors/QuillEditor'
import { useState } from 'react'
import { useCreateComment } from '@/shared/queries/useComment'
import { addToast } from '@heroui/react'

type Props = { jobId: string; parentId?: string | null; isReply?: boolean }
export default function CommentForm({
    jobId,
    parentId,
    isReply = false,
}: Props) {
    const { mutateAsync: createCommentMutation, isPending: isLoading } =
        useCreateComment()
    const { profile } = useAuth()

    const [commentValue, setCommentValue] = useState<string>('')

    const handleComment = async (comment?: string) => {
        if (!comment) {
            addToast({
                title: 'Vui lòng nhập bình luận trước khi gửi',
                color: 'danger',
            })
        }
        try {
            await createCommentMutation({
                userId: profile?.id ?? '',
                content: commentValue,
                jobId: jobId,
                parentId: parentId,
            })
            addToast({
                title: 'Đăng bình luận thành công',
                color: 'success',
            })
            setCommentValue('')
        } catch (error) {
            console.log(error)
            addToast({
                title: 'Đã xảy ra lỗi',
                color: 'danger',
            })
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
                <p className="pt-1 font-medium text-base">
                    {isReply ? 'Reply' : 'Add a comment'}
                </p>
                <div className="w-full">
                    <QuillEditor
                        defaultValue={commentValue}
                        onChange={(value) => {
                            setCommentValue(value)
                        }}
                    />
                    <div className="mt-2 flex items-center justify-end gap-3">
                        <HeroButton
                            color="blue"
                            variant="solid"
                            onPress={() => {
                                handleComment(commentValue)
                            }}
                            isLoading={isLoading}
                        >
                            Comment
                        </HeroButton>
                    </div>
                </div>
            </div>
        </div>
    )
}
