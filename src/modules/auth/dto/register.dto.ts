import { IsEmail, IsPhoneNumber, IsString, IsStrongPassword } from "class-validator";

export class RegisterBodyDto {


    @IsString()
    name: string;


    // @IsEmail()
    // email: string;

    @IsPhoneNumber('DZ')
    phone: string;

    @IsString()
    region: string

    @IsStrongPassword()
    password: string;

}