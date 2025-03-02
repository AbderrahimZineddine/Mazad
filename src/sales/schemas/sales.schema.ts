/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Sales extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  region: string;

  @Prop({ required: true })
  image: string;

}

export const SalesSchema = SchemaFactory.createForClass(Sales);