/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";
// import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from "@nestjs/mongoose";
import { SalesModule } from "./sales/sales.module";
import { UsersModule } from "./modules/users/users.module";
import { ProductsModule } from "./products/products.module";
import { AuctionsModule } from "./modules/auctions/auction.module";
import { AuthModule } from "./modules/auth/auth.module";
import { BidsModule } from "./modules/bids/bids.module";
import { BannerModule } from "./modules/banner/banner.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    //TODO ???
    ConfigModule.forRoot({
      isGlobal: true, // Makes the config available globally
    }),

    MongooseModule.forRoot(
      process.env.MONGO_URI || "mongodb://localhost:27017/mazad-app"
    ),
    SalesModule,
    AuctionsModule,
    UsersModule,
    ProductsModule,
    AuthModule,
    BidsModule,
    BannerModule,
  ],
})
export class AppModule {}
