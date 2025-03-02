/* eslint-disable prettier/prettier */
import { IsString } from 'class-validator';
// import { Type } from 'class-transformer';
// import { ApiProperty } from '@nestjs/swagger';
// import { IsAfterConstraint } from 'src/common/validators/date-order.validator';

export class CreateSaleDto {
  @IsString()
  title: string;

  @IsString()
  region: string;

  @IsString()
  image: string;

  // @IsDate()
  // @Type(() => Date)
  // beginDate: Date;

  // @IsDate()
  // @Type(() => Date)
  // @MinDate(new Date(), { message: 'End date must be in the future' })
  // @Validate(IsAfterConstraint, ['beginDate'])
  // endDate: Date;
  
}