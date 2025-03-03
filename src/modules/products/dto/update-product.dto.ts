/* eslint-disable prettier/prettier */
// update-product.dto.ts
import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { ValidateIf } from 'class-validator';

export class UpdateProductDto extends PartialType(
  OmitType(CreateProductDto, ['auction'] as const) // Remove auction from allowed fields
) {
  @ValidateIf(o => Object.keys(o).length > 0)
  dummyField?: never;
}