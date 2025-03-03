/* eslint-disable prettier/prettier */
// src/bids/dto/update-bid.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateBidDto } from './create-bid.dto';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateBidDto extends PartialType(CreateBidDto) {
  @IsOptional()
  @IsEnum(['Pending', 'Accepted', 'Rejected'])
  status?: string;
}