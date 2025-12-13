import { RouterProvider, createRouter } from '@tanstack/react-router'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import './styles/global.css'

// Import file được tự động sinh ra
import { routeTree } from './routeTree.gen'

// Tạo router instance
const router = createRouter({ routeTree })

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
