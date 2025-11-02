import * as yup from 'yup'

const configSchema = yup.object({
    NEXT_PUBLIC_APP_TITLE: yup.string(),
    NEXT_PUBLIC_APP_VERSION: yup.string(),
    NEXT_PUBLIC_API_ENDPOINT: yup.string(),
    NEXT_PUBLIC_URL: yup.string(),
    NEXT_PUBLIC_WS_URL: yup.string(),
})

function configProject() {
    try {
        const config = configSchema.validateSync({
            NEXT_PUBLIC_APP_TITLE: process.env.NEXT_PUBLIC_APP_TITLE,
            NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION,
            NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT,
            NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
            NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL,
        })
        return config
    } catch (error) {
        console.log(error)
        throw new Error('Các giá trị khai báo trong file .env không hợp lệ')
    }
}

export const envConfig = configProject()
