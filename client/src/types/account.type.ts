import { AccountProvider } from "../enums/accountProvider.enum"
import { User } from "./user.type"

export interface Account {
	id: string
	provider: AccountProvider // "GOOGLE" | "GITHUB" | "MICROSOFT" | "FACEBOOK" | "LOCAL"
	providerId: string
	userId: string
	user: User
}
