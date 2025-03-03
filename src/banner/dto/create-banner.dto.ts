/* eslint-disable prettier/prettier */
import { IsArray, IsString } from 'class-validator';

export class CreateBannerDto {
    @IsString()
      title: string;
    
      @IsString()
      region: string;
    
      @IsArray()
      @IsString({ each: true })
      images: string[];
}
