import { IsNumber, Validate } from "class-validator";
import { IsEmailOrPhoneConstraint } from "src/core/validators/is-email-or-phone";


export class VerifyAccountBodyDto {
    /**
     * The verification code sent to the user
     * @example '123456'
     */
    @IsNumber()
    otp: number;

}
