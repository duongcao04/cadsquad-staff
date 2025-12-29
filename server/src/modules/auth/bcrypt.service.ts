import { Injectable } from '@nestjs/common'
import { compare, compareSync, genSalt, hash } from 'bcrypt'

@Injectable()
export class BcryptService {
	async hash(data: string): Promise<string> {
		const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS)
		const salt = await genSalt(SALT_ROUNDS)

		return await hash(data, salt)
	}

	async compare(plainText: string, hashed: string): Promise<boolean> {
		if (plainText === hashed) {
			return true
		}

		return await compare(plainText, hashed)
	}
}