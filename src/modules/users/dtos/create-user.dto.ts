/* eslint-disable prettier/prettier */
// create-user.dto.ts
import { IsString, IsNotEmpty, MinLength } from "class-validator";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  region: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
