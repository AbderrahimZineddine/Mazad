/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Banner extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  region: string;

  @Prop({ required: true })
  images: string[];

}

export const BannerSchema = SchemaFactory.createForClass(Banner);