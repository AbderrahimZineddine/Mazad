/* eslint-disable prettier/prettier */
import { 
    IsString, IsDate, IsNumber, Min, 
    IsNotEmpty, MinDate, 
  } from 'class-validator';
  import { Type } from 'class-transformer';
  
  export class CreateAuctionDto {
    @IsString()
    @IsNotEmpty()
    title: string;
  
    @IsDate()
    @MinDate(new Date())
    @Type(() => Date)
    date: Date;
  
    @IsString()
    @IsNotEmpty()
    wilaya: string;
  
    @IsNumber()
    @Min(0)
    subscriptionFeeDinar: number;
  
    @IsNumber()
    @Min(0)
    subscriptionFeePoints: number;
  
    // // Note: 'description' exists in Joi but not in model - add if needed
    // @IsString()
    // @IsOptional()
    // description?: string;
    
  }