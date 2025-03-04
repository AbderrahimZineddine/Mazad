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
import { JwtAuthModule } from "./core/module/jwt-auth.module";
import { DatabaseModule } from "./core/module/database.module";
import { APP_FILTER } from "@nestjs/core";
import { HttpExceptionFilter } from "./core/interceptors/http-exception.filter";

@Module({
  imports: [

    ConfigModule.forRoot({
      isGlobal: true, // Makes the config available globally
    }),

    DatabaseModule.forRoot(
      'MAZAD'
    ),

    JwtAuthModule.register(),

    AuctionsModule,
    UsersModule,
    ProductsModule,
    AuthModule,
    BidsModule,
    BannerModule,
  ],

  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ]
})
export class AppModule { }
