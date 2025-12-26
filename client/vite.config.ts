import tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
    // Prevent Vite from obscuring Rust errors
    clearScreen: false,
    // Tauri expects a fixed port, fail if that port is not available
    // Make sure to use the TAURI_PLATFORM etc env variables
    envPrefix: ["VITE_", "TAURI_"],
    server: {
        port: 3000, // Thay đổi port
        host: true, // Mở port ra mạng local nếu cần truy cập từ thiết bị khác
        strictPort: true, // Buộc Vite phải dùng đúng port này, nếu không sẽ báo lỗi
        allowedHosts: ['nonresiliently-sociologistic-liliana.ngrok-free.dev'],
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
    build: {
        rollupOptions: {
            onwarn(warning, warn) {
                // Bỏ qua cảnh báo về "use client"
                if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
                    return
                }
                warn(warning)
            },
        },
        // Tauri uses Chromium on Windows and WebKit on macOS and Linux
        target: process.env.TAURI_PLATFORM == "windows" ? "chrome105" : "safari13",
        // Don't minify for debug builds
        minify: !process.env.TAURI_DEBUG ? "esbuild" : false,
        // Produce sourcemaps for debug builds
        sourcemap: !!process.env.TAURI_DEBUG,
    },
})
