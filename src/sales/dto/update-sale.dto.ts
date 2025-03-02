/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateSaleDto } from './create-sale.dto';
// import { IsDate, MinDate, ValidateIf } from 'class-validator';
// import { Type } from 'class-transformer';

export class UpdateSaleDto extends PartialType(CreateSaleDto) {
  
}