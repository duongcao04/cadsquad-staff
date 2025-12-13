import { RoleEnum } from '../enums'
import RoleGuard from './role-guard'

// 1. Basic Auth Guard
// Allow ANY logged-in user (User, Admin, Accounting, etc.)
export function AuthGuard({ children }: { children: React.ReactNode }) {
    return <RoleGuard>{children}</RoleGuard>
}

// 2. Admin Guard
// Only for Super Admins
export function AdminGuard({ children }: { children: React.ReactNode }) {
    return <RoleGuard allowedRoles={[RoleEnum.ADMIN]}>{children}</RoleGuard>
}

// 3. Accounting Guard
// Allows Accounting Staff AND Admins (Admins usually need access to everything)
export function AccountingGuard({ children }: { children: React.ReactNode }) {
    return (
        <RoleGuard allowedRoles={[RoleEnum.ACCOUNTING, RoleEnum.ADMIN]}>
            {children}
        </RoleGuard>
    )
}

// 4. Example: Manager Guard (if you have this role)
// export function ManagerGuard({ children }: { children: React.ReactNode }) {
//     return (
//         <RoleGuard allowedRoles={[RoleEnum.MANAGER, RoleEnum.ADMIN]}>
//             {children}
//         </RoleGuard>
//     )
// }
