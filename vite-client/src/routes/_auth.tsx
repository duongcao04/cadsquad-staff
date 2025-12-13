import { createFileRoute, Outlet } from '@tanstack/react-router'

// Lưu ý: path là id ảo, không xuất hiện trên URL
export const Route = createFileRoute('/_auth')({
    component: AuthLayout,
})

function AuthLayout() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-6 bg-white rounded shadow">
                <Outlet />
            </div>
        </div>
    )
}
