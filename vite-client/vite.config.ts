import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
    server: {
        port: 3000, // Thay đổi port
        host: true, // Mở port ra mạng local nếu cần truy cập từ thiết bị khác
        strictPort: true, // Buộc Vite phải dùng đúng port này, nếu không sẽ báo lỗi
    },
    plugins: [
        tailwindcss(),
        TanStackRouterVite(),
        react({
            babel: {
                plugins: [['babel-plugin-react-compiler']],
            },
        }),
    ], // 2. Thêm đoạn này
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
})
