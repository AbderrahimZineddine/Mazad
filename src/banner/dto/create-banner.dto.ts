/* eslint-disable prettier/prettier */
import { IsArray, IsString } from 'class-validator';

export class CreateBannerDto {
    @IsString()
      title: string;
    
      @IsString()
      region: string;
    
      @IsArray()
      images: string[];
}
