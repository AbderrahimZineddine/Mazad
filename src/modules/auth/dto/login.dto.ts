import { IsStrongPassword, Validate } from "class-validator";
import { IsEmailOrPhoneConstraint } from "src/core/validators/is-email-or-phone";

export class LoginBodyDto {

    /**
     * The login of the user (email or phone number)
     * @example 'ahmed@gmail.com'
     */
    @Validate(IsEmailOrPhoneConstraint)
    login: string;

    /**
     * The password of the user 
     * @example 'Password123@'
     */
    @IsStrongPassword()
    password: string;

}


