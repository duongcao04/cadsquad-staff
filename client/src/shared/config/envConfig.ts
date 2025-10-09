import * as yup from 'yup'

const configSchema = yup.object({
    NODE_ENV: yup.string(),
    NEXT_PUBLIC_API_ENDPOINT: yup.string(),
    NEXT_PUBLIC_URL: yup.string(),
    NEXT_PUBLIC_CADSQUAD_EMAIL: yup.string(),
    NEXT_PUBLIC_NODEMAILER_PORT: yup.string(),
    NEXT_PUBLIC_SMTP_USER: yup.string(),
    NEXT_PUBLIC_SMTP_PASS: yup.string(),
    NEXT_PUBLIC_SUPABASE_URL: yup.string(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: yup.string(),
    NEXT_PUBLIC_SUPABASE_JWT_KEY: yup.string(),
})

function configProject() {
    try {
        const config = configSchema.validateSync({
            NODE_ENV: process.env.NODE_ENV,
            NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT,
            NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
            NEXT_PUBLIC_CADSQUAD_EMAIL: process.env.NEXT_PUBLIC_CADSQUAD_EMAIL,
            NEXT_PUBLIC_NODEMAILER_PORT:
                process.env.NEXT_PUBLIC_NODEMAILER_PORT,
            NEXT_PUBLIC_SMTP_USER: process.env.NEXT_PUBLIC_SMTP_USER,
            NEXT_PUBLIC_SMTP_PASS: process.env.NEXT_PUBLIC_SMTP_PASS,
            NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
            NEXT_PUBLIC_SUPABASE_JWT_KEY:
                process.env.NEXT_PUBLIC_SUPABASE_JWT_KEY,
            NEXT_PUBLIC_SUPABASE_ANON_KEY:
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        })
        return config
    } catch (error) {
        console.log(error)
        throw new Error('Các giá trị khai báo trong file .env không hợp lệ')
    }
}

export const envConfig = configProject()
