import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class LoginUsersDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'SGG123',
    description: 'Username for the user',
  })
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, {
    message: 'Password must be at least 8 characters',
  })
  @MaxLength(20, {
    message: 'Password must be at most 20 characters',
  })
  @ApiProperty({
    example: 'P@ssw0rd',
    description: 'Must be 8-20 characters',
  })
  password: string;
}
