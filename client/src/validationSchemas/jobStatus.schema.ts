import * as yup from "yup"

export const CreateJobStatusSchema = yup.object({
	displayName: yup
		.string()
		.required("Display name is required"),

	thumbnailUrl: yup
		.string()
		.url("thumbnailUrl must be a valid URL")
		.optional(),

	hexColor: yup
		.string()
		.matches(/^#([0-9A-Fa-f]{6})$/, "hexColor must be a valid hex color code (e.g. #FFFFFF)")
		.required("hexColor is required"),

	order: yup
		.number()
		.integer("Order must be an integer")
		.required("Order is required"),

	icon: yup
		.string()
		.optional(),

	nextStatusOrder: yup
		.number()
		.integer("nextStatusOrder must be an integer")
		.optional(),

	prevStatusOrder: yup
		.number()
		.integer("prevStatusOrder must be an integer")
		.optional(),
})
export type CreateJobStatusInput = yup.InferType<typeof CreateJobStatusSchema>