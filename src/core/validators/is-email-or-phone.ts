import { isEmail, isPhoneNumber, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint({ name: 'IsEmailOrPhone', async: false })
export class IsEmailOrPhoneConstraint implements ValidatorConstraintInterface {
    validate(value: string, _args: ValidationArguments): boolean {

        return isEmail(value) || isPhoneNumber(value, 'DZ');
    }

    defaultMessage(args: ValidationArguments): string {
        return `${args.property} must be a valid email or phone number`;
    }
}