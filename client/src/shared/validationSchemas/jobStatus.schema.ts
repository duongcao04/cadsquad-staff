import * as yup from 'yup'

export const CreateJobStatusInputSchema = yup.object({
  displayName: yup.string().required('Display name is required'),
  thumbnailUrl: yup.string().url().optional(),
  hexColor: yup.string().matches(/^#([0-9A-Fa-f]{6})$/, 'Must be a valid hex color').required('Hex color is required'),
  order: yup.number().integer().required('Order is required'),
  code: yup.string().optional(),
  icon: yup.string().optional(),
  nextStatusOrder: yup.number().integer().optional(),
  prevStatusOrder: yup.number().integer().optional(),
})

export type CreateJobStatusInput = yup.InferType<typeof CreateJobStatusInputSchema>

export const UpdateJobStatusInputSchema = CreateJobStatusInputSchema.partial()

export type UpdateJobStatusInput = yup.InferType<typeof UpdateJobStatusInputSchema>
