/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateSaleDto } from './create-sale.dto';
import { IsDate, MinDate, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateSaleDto extends PartialType(CreateSaleDto) {
  @ValidateIf((o) => o.beginDate !== undefined)
  @IsDate()
  @Type(() => Date)
  beginDate?: Date;

  @ValidateIf((o) => o.endDate !== undefined)
  @IsDate()
  @Type(() => Date)
  @MinDate(new Date(), { message: 'End date must be in the future' })
  endDate?: Date;
}