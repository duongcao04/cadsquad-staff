import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { PERMISSIONS_KEY } from '../decorators/require-permissions.decorator'

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        // 1. Get the required permissions from the route metadata
        const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
            PERMISSIONS_KEY,
            [context.getHandler(), context.getClass()]
        )

        // If the route has no @RequirePermissions decorator, allow access
        if (!requiredPermissions) {
            return true
        }

        // 2. Get the user from the request (Populated by JwtAuthGuard)
        const { user } = context.switchToHttp().getRequest()

        // Safety check: If user isn't logged in or has no role data
        if (!user || !user.role || !user.role.permissions) {
            console.warn(
                'PermissionsGuard: User missing role or permissions data'
            )
            throw new ForbiddenException('Access Denied: No role assigned')
        }

        // 3. Extract the user's permission strings
        // Based on your schema, user.role.permissions is an array of Permission objects.
        // We map them to the 'entityAction' string (e.g., "job.read")
        const userPermissionStrings = user.role.permissions.map(
            (p) => p.entityAction
        )

        // 4. Check if the User has ALL (or ANY) of the required permissions.
        // STRATEGY: "Has AT LEAST ONE of the required permissions"
        // (If you want them to have ALL, change .some() to .every())
        const hasPermission = requiredPermissions.some((required) =>
            userPermissionStrings.includes(required)
        )

        if (!hasPermission) {
            throw new ForbiddenException(
                `Missing required permission: ${requiredPermissions.join(', ')}`
            )
        }

        return true
    }
}
