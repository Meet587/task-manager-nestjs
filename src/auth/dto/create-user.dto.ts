import { IsString, IsNotEmpty, MinLength, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
