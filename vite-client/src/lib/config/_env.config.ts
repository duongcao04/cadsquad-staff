import * as yup from 'yup'
import { removeTrailingSlash } from '../utils'

// 1. Add .required() for critical variables and defaults for others
const configSchema = yup.object({
  NEXT_PUBLIC_APP_TITLE: yup.string().default('App'),
  NEXT_PUBLIC_APP_VERSION: yup.string().default('1.0.0'),
  NEXT_PUBLIC_API_ENDPOINT: yup.string().required('NEXT_PUBLIC_API_ENDPOINT is required'),
  NEXT_PUBLIC_URL: yup.string().required('NEXT_PUBLIC_URL is required'),
  NEXT_PUBLIC_WS_URL: yup.string().optional(), // WebSocket might be optional
})

function configProject() {
  try {
    const config = configSchema.validateSync(
      {
        NEXT_PUBLIC_APP_TITLE: process.env.NEXT_PUBLIC_APP_TITLE,
        NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION,
        
        // Clean usage: Only run removeTrailingSlash if value exists
        NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT,
        NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
        NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL,
      },
      {
        abortEarly: false, // Show all missing vars at once, not just the first one
      }
    )

    return config
  } catch (error) {
    // 3. Log specific validation errors so you know what to fix
    if (error instanceof yup.ValidationError) {
        console.error('❌ Env Validation Error:', error.errors);
    } else {
        console.error(error);
    }
    throw new Error('Các giá trị khai báo trong file .env không hợp lệ')
  }
}

export const envConfig = configProject()