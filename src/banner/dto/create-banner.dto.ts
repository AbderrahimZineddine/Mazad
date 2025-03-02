/* eslint-disable prettier/prettier */
import { IsString } from 'class-validator';

export class CreateBannerDto {
    @IsString()
      title: string;
    
      @IsString()
      region: string;
    
      @IsString()
      image: string;
}
