import { RoleEnum } from "@prisma/client"

export class TokenPayload {
	sub: string
	email: string
	role: RoleEnum
	iat: string
}