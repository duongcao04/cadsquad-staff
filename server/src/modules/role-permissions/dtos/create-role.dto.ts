import {
    IsArray,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator'

export class CreateRoleDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsArray()
    @IsString({ each: true }) // Ensures every item in array is a Number
    permissionIds: string[]
}
