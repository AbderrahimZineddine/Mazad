/* eslint-disable prettier/prettier */
// src/auctions/schemas/auction.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Auction extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  wilaya: string;

  @Prop([String])
  categories: string[];

  @Prop({ 
    enum: ['Open', 'Closed'],
    default: 'Open'
  })
  status: string;

  @Prop({ required: true })
  subscriptionFeeDinar: number;

  @Prop({ required: true })
  subscriptionFeePoints: number;

  @Prop([{ type: Types.ObjectId, ref: 'Product' }])
  products: Types.ObjectId[];

  @Prop([{ type: Types.ObjectId, ref: 'User' }])
  subscribers: Types.ObjectId[];
}

export const AuctionSchema = SchemaFactory.createForClass(Auction);