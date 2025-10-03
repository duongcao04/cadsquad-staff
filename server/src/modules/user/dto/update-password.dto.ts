import { IsNotEmpty, IsString, Matches } from 'class-validator'

export class UpdatePasswordDto {
	@IsString()
	@IsNotEmpty({ message: 'Old password is required' })
	oldPassword: string

	@IsString()
	@IsNotEmpty({ message: 'New password is required' })
	@Matches(
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
		{
			message:
				'Password must be at least 8 characters long, include uppercase, lowercase, number and special character',
		},
	)
	newPassword: string

	@IsString()
	@IsNotEmpty({ message: 'Confirm new password is required' })
	newConfirmPassword: string
}
