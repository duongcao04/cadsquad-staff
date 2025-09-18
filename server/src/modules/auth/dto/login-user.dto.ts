import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    default: 'ch.duong@cadsquad.vn'
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    default: 'cadsquad123'
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
