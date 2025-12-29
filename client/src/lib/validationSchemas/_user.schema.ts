import * as yup from 'yup'
import { z } from 'zod'

export const CreateUserSchema = yup.object().shape({
    email: yup.string().required('Email is required'),
    avatar: yup.string(),
    username: yup.string().optional(),
    password: yup.string().optional(),
    displayName: yup.string().required('Display name is required'),
    jobTitleId: yup.string().optional(),
    departmentId: yup.string().optional(),
    phoneNumber: yup.string().optional(),

    // Optional enum validation
    role: yup
        .mixed<'USER' | 'ADMIN' | 'ACCOUNTING'>()
        .oneOf(['USER', 'ADMIN', 'ACCOUNTING'], 'Invalid role')
        .default('USER'),
})
export type TCreateUserInput = yup.InferType<typeof CreateUserSchema>

export const UpdateUserSchema = CreateUserSchema.partial()
export type TUpdateUserInput = yup.InferType<typeof UpdateUserSchema>


// Define the available roles to match your backend/Prisma enum
export const RoleEnum = z.enum(['ADMIN', 'USER', 'ACCOUNTING'])

export const editUserSchema = z.object({
    displayName: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must be less than 50 characters'),
    username: z
        .string()
        .min(3, 'Username must be at least 3 characters')
        .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    email: z
        .string()
        .email('Please enter a valid email address'),
    phoneNumber: z
        .string()
        .optional()
        .or(z.literal('')), // Allow empty string or undefined
    bio: z
        .string()
        .max(500, 'Bio cannot exceed 500 characters')
        .optional()
        .or(z.literal('')),
    departmentId: z.string().optional().or(z.literal('')),
    jobTitleId: z.string().optional().or(z.literal('')),
    role: RoleEnum,
    isActive: z.boolean(),
})

// Export the type to be used in the component
export type EditUserValues = z.infer<typeof editUserSchema>
