import { IsNotEmpty, IsString, Matches } from 'class-validator'

export class ResetPasswordDto {
	@IsString()
	@IsNotEmpty({ message: 'New password is required' })
	@Matches(
		/^.{8,}$/,
		{
			message:
				'Password must be at least 8 characters long',
		},
	)
	newPassword: string
}
