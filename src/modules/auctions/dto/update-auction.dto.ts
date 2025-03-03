/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateAuctionDto } from './create-auction.dto';
import { IsEnum, ValidateIf } from 'class-validator';

export class UpdateAuctionDto extends PartialType(CreateAuctionDto) {
  @IsEnum(['Open', 'Closed'], {
    message: 'Status must be either "Open" or "Closed"'
  })
  @ValidateIf(o => o.status !== undefined)
  status?: string;

  // Ensure at least one field is provided
  @ValidateIf(o => Object.keys(o).length > 0)
  dummyField?: never;
}