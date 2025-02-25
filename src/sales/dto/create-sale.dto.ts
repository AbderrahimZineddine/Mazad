/* eslint-disable prettier/prettier */
import { IsString, IsDate, MinDate, Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsAfterConstraint } from 'src/common/validators/date-order.validator';

export class CreateSaleDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  location: string;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  beginDate: Date;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  @MinDate(new Date(), { message: 'End date must be in the future' })
  @Validate(IsAfterConstraint, ['beginDate'])
  endDate: Date;
  
}