/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AbstractSchema } from 'src/core/models/abstract-schema';


@Schema({ timestamps: true })
export class User extends AbstractSchema {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  region: string;

  @Prop({ required: true, unique: true })
  phone: string;

  @Prop({ default: 0 })
  points: number;

  @Prop({
    enum: ['User', 'Admin'],
    default: 'User'
  })
  role: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ required: true })
  password: string;

  @Prop({ default: null })
  newPassword?: string;

  @Prop({ default: null })
  newPasswordExpires?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = User & Document;
