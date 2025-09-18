import { IsArray, IsNotEmpty, IsString } from 'class-validator'

export class UpdateJobMembersDto {
  @IsNotEmpty()
  @IsString()
  prevMemberIds?: string

  @IsNotEmpty()
  @IsString()
  updateMemberIds?: string
}