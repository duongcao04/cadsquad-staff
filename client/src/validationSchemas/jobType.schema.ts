import * as yup from "yup"

export const CreateJobTypeSchema = yup.object({
	code: yup
		.string()
		.required("Code is required"),

	displayName: yup
		.string()
		.required("Display name is required"),

	hexColor: yup
		.string()
		.matches(/^#([0-9A-Fa-f]{6})$/, "hexColor must be a valid hex color code (e.g. #FFFFFF)")
		.optional(),
})
export type CreateJobTypeInput = yup.InferType<typeof CreateJobTypeSchema>