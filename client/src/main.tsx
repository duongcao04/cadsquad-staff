import './styles/global.css'

import { createRouter, RouterProvider } from '@tanstack/react-router'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'

// Import file được tự động sinh ra
import { routeTree } from './routeTree.gen'
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
})

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
