import * as yup from "yup"

// Create Comment Schema
export const CreateCommentSchema = yup.object({
	content: yup
		.string()
		.required("Comment content is required")
		.max(1000, "Comment cannot exceed 1000 characters"),

	jobId: yup
		.string()
		.required("Post ID is required"),

	parentId: yup
		.string()
		.nullable()
		.optional(), // For replies

	userId: yup
		.string()
		.required("Author ID is required"),
})

export type CreateCommentInput = yup.InferType<typeof CreateCommentSchema>

// Update Comment Schema (partial of create)
export const UpdateCommentSchema = CreateCommentSchema.shape({
	content: yup
		.string()
		.max(1000, "Comment cannot exceed 1000 characters")
		.optional(),
	postId: yup.string().optional(),
	parentId: yup.string().nullable().optional(),
	authorId: yup.string().optional(),
}).partial()

export type UpdateCommentInput = yup.InferType<typeof UpdateCommentSchema>
