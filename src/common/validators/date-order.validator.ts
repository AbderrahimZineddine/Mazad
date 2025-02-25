/* eslint-disable prettier/prettier */
// src/common/validators/date-order.validator.ts
import { 
    ValidationArguments, ValidatorConstraint, 
    ValidatorConstraintInterface 
  } from 'class-validator';
  
  @ValidatorConstraint({ name: 'isAfter', async: false })
  export class IsAfterConstraint implements ValidatorConstraintInterface {
    validate(propertyValue: string, args: ValidationArguments) {
      return propertyValue > args.object[args.constraints[0]];
    }
  
    defaultMessage(args: ValidationArguments) {
      return `${args.property} must be after ${args.constraints[0]}`;
    }
  }