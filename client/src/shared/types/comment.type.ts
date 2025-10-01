import { Comment } from "@/shared/interfaces/comment.interface"
import { Job } from "@/shared/interfaces/job.interface"
import { User } from "@/shared/interfaces/user.interface"

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