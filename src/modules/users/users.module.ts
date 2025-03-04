/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./schemas/user.schema";
import { AuthModule } from "../auth/auth.module"; // Use relative path
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";

// users.module.ts
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),

  ],
  exports: [
    UsersService,
  ],
  providers: [UsersService],
  controllers: [UsersController],

})
export class UsersModule {}
