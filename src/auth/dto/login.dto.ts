import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
