/* eslint-disable prettier/prettier */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Product } from '../../products/schemas/product.schema';

export type BidDocument = Bid & Document;

@Schema({ timestamps: true })
export class Bid {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  product: Product;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, min: 1 })
  quantity: number;

  @Prop({
    enum: ['Pending', 'Accepted', 'Rejected'],
    default: 'Pending'
  })
  status: string;
}

export const BidSchema = SchemaFactory.createForClass(Bid);