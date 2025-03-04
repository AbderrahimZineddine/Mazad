/* eslint-disable prettier/prettier */
import { 
    IsString, IsDate,  
    IsNotEmpty, MinDate,
    IsNumber, 
  } from 'class-validator';
  import { Type } from 'class-transformer';
  
  export class CreateAuctionDto {
    @IsString()
    @IsNotEmpty()
    title: string;
  
    @IsDate()
    @MinDate(new Date())
    @Type(() => Date)
    endingDate: Date;
  
    @IsString()
    @IsNotEmpty()
    region: string;
  
    @IsNumber()
    subscriptionFeeDinar: number;
  
    // @IsNumber()
    // @Min(0)
    // subscriptionFeePoints: number;
  
    // // Note: 'description' exists in Joi but not in model - add if needed
    // @IsString()
    // @IsOptional()
    // description?: string;
    
  }