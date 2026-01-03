import './styles/global.css'

import { QueryClient } from '@tanstack/react-query'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'

// Import file được tự động sinh ra
import { routeTree } from './routeTree.gen'

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
})

if (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone
) {
    document.addEventListener(
        'click',
        (e: MouseEvent) => {
            // Sử dụng ép kiểu để lấy thẻ <a> gần nhất
            const target = (e.target as HTMLElement).closest('a')

            // Kiểm tra target có tồn tại và có href không
            if (target && target.href) {
                // Kiểm tra nếu link dẫn ra ngoài domain hiện tại
                const isInternal = target.href.includes(window.location.origin)

                // Nếu là link nội bộ và không phải mở tab mới (_blank)
                if (isInternal && !target.getAttribute('target')) {
                    e.preventDefault()
                    window.location.href = target.href
                }
            }
        },
        false
    )
}
// Tạo router instance
const router = createRouter({
    routeTree,
    // Show loader immediately (0ms delay)
    defaultPendingMs: 0,
    context: {
        queryClient,
    },
})

// Đăng ký kiểu dữ liệu (Quan trọng để có Type-safe)
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement)
    root.render(
        <StrictMode>
            <RouterProvider router={router} />
        </StrictMode>
    )
}
