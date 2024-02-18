import { IsEmail, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(30)
  email: string;

  @IsOptional()
  @MaxLength(10)
  name?: string;

  @IsNotEmpty()
  @MaxLength(20)
  password: string;
}
