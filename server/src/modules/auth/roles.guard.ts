import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) { }

	canActivate(context: ExecutionContext): boolean {
		// 1. Lấy danh sách role yêu cầu từ metadata (của hàm hoặc của class)
		const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
			context.getHandler(),
			context.getClass(),
		]);

		// 2. Nếu route không yêu cầu role nào cụ thể -> Cho qua
		if (!requiredRoles) {
			return true;
		}

		// 3. Lấy user từ request
		const { user } = context.switchToHttp().getRequest();

		// Kiểm tra user có tồn tại không
		if (!user || !user.role) {
			throw new ForbiddenException('Access denied: No user found');
		}

		// 4. Kiểm tra xem user.role có nằm trong danh sách requiredRoles không
		const hasRole = requiredRoles.includes(user.role);

		if (!hasRole) {
			throw new ForbiddenException(`Access denied: Requires one of the following roles: ${requiredRoles.join(', ')}`);
		}

		return true;
	}
}