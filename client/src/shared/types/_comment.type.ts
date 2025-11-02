import { Comment, Job, User } from "@/shared/interfaces"

export type CommentWithJob = Comment & {
	job: Job
}
export type CommentWithUser = Comment & {
	user: User
}
export type CommentWithParent = Comment & {
	parent: Comment
}
export type CommentWithReply = Comment & {
	replies: Comment[]
}
export type CommentRefAll = CommentWithJob & CommentWithUser & CommentWithParent & CommentWithReply