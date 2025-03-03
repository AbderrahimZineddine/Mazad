/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";
import { BidsService } from "./bids.service";
import { BidsController } from "./bids.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Bid, BidSchema } from "./schemas/bid.schema";
import { ProductsModule } from "../products/products.module";
import { AuctionsModule } from "src/modules/auctions/auction.module";
import { UsersModule } from "src/modules/users/users.module";
import { AuthModule } from "src/modules/auth/auth.module";
import { ValidateBidCreationGuard } from "src/guards/validate-bid-creation.guard";
import { ValidateBidUpdateGuard } from "src/guards/validate-bid-update.guard";
import { ValidateBidDeletionGuard } from "src/guards/validate-bid-deletion.guard";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Bid.name, schema: BidSchema }]),
    AuctionsModule,
    ProductsModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [BidsController],
  providers: [
    BidsService,
    ValidateBidCreationGuard,
    ValidateBidUpdateGuard,
    ValidateBidDeletionGuard,
  ],
  exports: [BidsService],
})
export class BidsModule {}
