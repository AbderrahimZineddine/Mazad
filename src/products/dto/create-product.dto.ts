/* eslint-disable prettier/prettier */
import { IsString, IsNumber, IsArray, IsOptional, Min, IsNotEmpty, IsMongoId } from 'class-validator';

export class CreateProductDto {
  @IsMongoId()
  @IsNotEmpty()
  auction: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsNumber()
  @Min(0)
  initialPrice: number;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsArray()
  @IsNumber({}, { each: true })
  @Min(1, { each: true })
  bidAmounts: number[];
}