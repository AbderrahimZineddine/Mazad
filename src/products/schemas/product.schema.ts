/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop([String])
  images: string[];

  @Prop({ required: true, min: 0 })
  initialPrice: number;

  @Prop({ required: true, min: 1 })
  quantity: number;

  @Prop({ required: true })
  category: string;

  @Prop([Number])
  bidAmounts: number[];

  @Prop({ type: Types.ObjectId, ref: "Auction", immutable: true })
  auction: Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
