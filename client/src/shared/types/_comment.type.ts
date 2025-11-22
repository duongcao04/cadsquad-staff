import { ICommentResponse } from "@/shared/interfaces"
import { TJob, TUser } from "../types"

export type TCommentWithJob = Comment & {
	job: TJob
}
export type TCommentWithUser = Comment & {
	user: TUser
}
export type TCommentWithParent = Comment & {
	parent: Comment
}
export type TCommentWithReply = Comment & {
	replies: Comment[]
}
export type TCommentRefAll = TCommentWithJob & TCommentWithUser & TCommentWithParent & TCommentWithReply

export type TComment = Omit<ICommentResponse, 'parentId' | 'jobId' | 'userId'>