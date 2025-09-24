
export interface RegisterUserDto {
  firstName: string
  lastName: string
  dob?: Date
  email: string
  password?: string
}

export interface LoginUserDto {
  email: string
  password?: string
}
