import * as yup from 'yup'

export const CreateConfigInputSchema = yup.object({
  displayName: yup.string().required('Display name is required'),
  code: yup.string().required('Code is required'),
  value: yup.string().required('Value is required'),
})

export type CreateConfigInput = yup.InferType<typeof CreateConfigInputSchema>

export const UpdateConfigInputSchema = CreateConfigInputSchema.partial()

export type UpdateConfigInput = yup.InferType<typeof UpdateConfigInputSchema>
