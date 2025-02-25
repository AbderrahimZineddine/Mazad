/* eslint-disable prettier/prettier */
// auctions.module.ts
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Auction, AuctionSchema } from "./schemas/auction.schema";
import { User, UserSchema } from "../users/schemas/user.schema";
import { AuctionsController } from "./auction.controller";
import { AuctionsService } from "./auction.service";
import { AuthModule } from "../auth/auth.module"; // Add this import

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Auction.name, schema: AuctionSchema },
      { name: User.name, schema: UserSchema },
    ]),
    AuthModule, // Add this line to inherit JwtService
  ],
  controllers: [AuctionsController],
  providers: [AuctionsService],
  exports: [
    MongooseModule.forFeature([
      {
        name: Auction.name,
        schema: AuctionSchema,
      },
    ]),
    AuctionsService,
  ], // Add this line
})
export class AuctionsModule {}
