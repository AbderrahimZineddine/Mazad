/* eslint-disable prettier/prettier */

// update-user.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ValidateIf } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ValidateIf(o => Object.keys(o).length > 0)
  dummyField?: never;
}