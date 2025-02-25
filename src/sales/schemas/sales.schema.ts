/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Sales extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  beginDate: Date;

  @Prop({ required: true })
  endDate: Date;
}

export const SalesSchema = SchemaFactory.createForClass(Sales);