/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";
// import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from "@nestjs/mongoose";
import { UsersModule } from "./modules/users/users.module";
import { AuctionsModule } from "./modules/auctions/auction.module";
import { AuthModule } from "./modules/auth/auth.module";
import { BidsModule } from "./modules/bids/bids.module";
import { BannerModule } from "./modules/banner/banner.module";
import { ConfigModule } from "@nestjs/config";
import { ProductsModule } from "./modules/products/products.module";

@Module({
  imports: [
    //TODO ???
    ConfigModule.forRoot({
      isGlobal: true, // Makes the config available globally
    }),

    MongooseModule.forRoot(
      process.env.MONGO_URI || "mongodb://localhost:27017/mazad-app"
    ),
    AuctionsModule,
    UsersModule,
    ProductsModule,
    AuthModule,
    BidsModule,
    BannerModule,
  ],
})
export class AppModule {}
