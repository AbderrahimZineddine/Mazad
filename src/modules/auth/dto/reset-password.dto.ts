import { IsEmail, IsNumber, IsStrongPassword } from "class-validator";

export class ForgotPassBodyDto {
    /**
     * The email of the user
     * @example 'ahmed@gmail.com'
     */
    @IsEmail()
    email: string;

}

export class CheckResetCodeBodyDto extends ForgotPassBodyDto {
    /**
     * The reset code sent to the user
     * @example '123456'
     */
    @IsNumber()
    otp: number;

}

export class ResetPassBodyDto extends CheckResetCodeBodyDto {
    /**
     * The new password of the user
     * @example 'Password123@'
     */
    @IsStrongPassword()
    password: string;

}