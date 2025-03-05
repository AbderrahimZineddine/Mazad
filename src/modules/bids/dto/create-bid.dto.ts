/* eslint-disable prettier/prettier */
// src/bids/dto/create-bid.dto.ts
import { IsMongoId, IsNumber, Min } from 'class-validator';

export class CreateBidDto {
  @IsMongoId()
  product: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsNumber()
  @Min(1)
  quantity: number;
}